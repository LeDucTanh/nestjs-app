import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus, BankAccount } from './entities/bank-account.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CreateAccountDto,
  GetAccountDto,
  TransferDto,
  WithdrawDto,
} from './dto/account.dto';
import { NumberHelper } from 'src/common/helpers/number.helper';
import { IRequestUser } from 'src/utils/interface/request.interface';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionType } from '../transaction/entities/transaction.entity';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly repo: Repository<BankAccount>,
    private readonly transactionService: TransactionService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateAccountDto, reqUser: IRequestUser) {
    const accNumber = NumberHelper.generateAccountNumber();
    const entity = this.repo.create({
      ...dto,
      accountNumber: `${accNumber}`,
      userId: reqUser.userId,
    });
    return await entity.save();
  }

  getList(reqUser: IRequestUser) {
    return this.repo.find({ where: { userId: reqUser.userId } });
  }

  async getAccountDetail(id: number, reqUser: IRequestUser) {
    const entity = await this.repo.findOne({
      where: { id, userId: reqUser.userId },
    });

    if (!entity) {
      throw new BadRequestException('BANK_ACCOUNT_NOT_FOUND');
    }

    return entity;
  }

  async getAccountInfo(dto: GetAccountDto, reqUser: IRequestUser) {
    const entity = await this.repo.findOne({
      where: { accountNumber: dto.accountNumber, userId: reqUser.userId },
    });

    if (!entity) {
      throw new BadRequestException('BANK_ACCOUNT_NOT_FOUND');
    }

    return entity;
  }

  async transfer(dto: TransferDto, reqUser: IRequestUser) {
    const { accountId, toAccountNumber, amount } = dto;
    const fromAccount = await this.repo.findOne({
      where: {
        id: accountId,
        userId: reqUser.userId,
        status: AccountStatus.Active,
      },
    });

    if (!fromAccount) {
      throw new BadRequestException('BANK_ACCOUNT_NOT_FOUND');
    }
    if (fromAccount.accountNumber === toAccountNumber) {
      throw new BadRequestException('NOT_ALLOW_TRANSFER_TO_ITSELF');
    }

    const toAccount = await this.repo.findOne({
      where: { accountNumber: toAccountNumber, status: AccountStatus.Active },
    });
    if (!toAccount) {
      throw new BadRequestException('ACCOUNT_NUMBER_NOT_FOUND');
    }

    if (fromAccount.totalAmount < amount) {
      throw new BadRequestException('INSUFFICIENT_BALANCE');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      fromAccount.totalAmount -= amount;
      toAccount.totalAmount += amount;
      await queryRunner.manager.save(fromAccount);
      await queryRunner.manager.save(toAccount);

      await this.transactionService.storeTransaction(
        {
          type: TransactionType.Transfer,
          amount: -amount,
          otherAccountNumber: toAccountNumber,
          userId: reqUser.userId,
          otherUserId: toAccount.userId,
          accountId,
        },
        queryRunner,
      );

      await this.transactionService.storeTransaction(
        {
          type: TransactionType.Transfer,
          amount,
          otherAccountNumber: fromAccount.accountNumber,
          userId: toAccount.userId,
          otherUserId: fromAccount.userId,
          accountId: toAccount.id,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(dto: WithdrawDto, reqUser: IRequestUser) {
    const { accountId, amount } = dto;
    const fromAccount = await this.repo.findOne({
      where: {
        id: accountId,
        userId: reqUser.userId,
        status: AccountStatus.Active,
      },
    });

    if (!fromAccount) {
      throw new BadRequestException('BANK_ACCOUNT_NOT_FOUND');
    }

    if (fromAccount.totalAmount < amount) {
      throw new BadRequestException('INSUFFICIENT_BALANCE');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      fromAccount.totalAmount -= amount;
      await queryRunner.manager.save(fromAccount);

      await this.transactionService.storeTransaction(
        {
          type: TransactionType.Withdraw,
          amount: -amount,
          userId: reqUser.userId,
          accountId,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
