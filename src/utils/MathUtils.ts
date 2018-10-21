

export abstract class MathUtils {

  static RandomInt(min: number, max: number): number {
    return (Math.floor(Math.random() * (max-min+1)) + min)
  }

  static PickRandom<T>(from: T[]): T {
    return from[this.RandomInt(0,from.length-1)];
  }

}
