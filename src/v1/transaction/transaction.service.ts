import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionDto } from './dto/transaction.dto';
import { IRequestUser } from 'src/utils/interface/request.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async storeTransaction(transaction: Object, queryRunner: QueryRunner) {
    const trans = queryRunner.manager.create(Transaction, transaction);
    return await queryRunner.manager.save(trans);
  }

  async getList(dto: TransactionDto, reqUser: IRequestUser) {
    return await this.repo.find({
      where: { accountId: dto.accountId, userId: reqUser.userId },
    });
  }
}
