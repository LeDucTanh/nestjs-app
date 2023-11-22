export class ColumnNumericTransformer {
  public to(data: number): number {
    return data;
  }

  public from(data: string): number {
    if (data) return parseFloat(data);
    return null;
  }
}
