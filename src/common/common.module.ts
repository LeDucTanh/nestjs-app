import { Module } from "@nestjs/common";
import { ColumnUniqueValidator } from "./validate-decorators";

@Module({
  imports: [
  ],
  providers: [
    ColumnUniqueValidator
  ],
  exports:[
  ]
})
export class CommonModule{}