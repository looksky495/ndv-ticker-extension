export type VariableAnimationType = "Normal" | "bc_4" | "bc_3" | "sliding" | "r_sliding" | "sliding_3";

const NOT_STARTED = -1;

export class VariableAnimation {
  time: number;
  type: VariableAnimationType;
  startTime: number;
  data: number[];
  isInt: boolean;

  #start_n: number;
  #end_n: number;

  constructor (time: number, type: VariableAnimationType, data: number[], isInt = false){
    if (![ "Normal", "bc_4", "bc_3", "sliding", "r_sliding", "sliding_3" ].includes(type))
      throw new Error(`Invalid animation type: ${type}`);

    this.time = time;
    this.type = type;
    this.#start_n = data[0] ?? 0;
    this.#end_n = data[1] ?? 0;
    this.startTime = NOT_STARTED;
    this.data = data;
    this.isInt = !!isInt;
  }

  start (){
    this.startTime = Date.now();
  }

  #calcValue (t: number): number {
    const tp = 1 - t;

    switch (this.type) {
      case "Normal":
        return t * this.#end_n + tp * this.#start_n;

      case "bc_4": {
        const p0 = this.data[0] ?? this.#start_n;
        const p1 = this.data[1] ?? this.#start_n;
        const p2 = this.data[2] ?? this.#end_n;
        const p3 = this.data[3] ?? this.#end_n;
        return t * t * t * p3 + 3 * t * t * tp * p2 + 3 * t * tp * tp * p1 + tp * tp * tp * p0;
      }

      case "bc_3": {
        const p0 = this.data[0] ?? this.#start_n;
        const p1 = this.data[1] ?? (this.#start_n + this.#end_n) / 2;
        const p2 = this.data[2] ?? this.#end_n;
        return tp * tp * p0 + 2 * tp * t * p1 + t * t * p2;
      }

      case "sliding":
        return Math.sqrt(1 - tp * tp) * (this.#end_n - this.#start_n) + this.#start_n;

      case "r_sliding":
        return Math.sqrt(1 - t * t) * (this.#end_n - this.#start_n) + this.#start_n;

      case "sliding_3":
        return Math.sqrt(1 - tp * tp * tp) * (this.#end_n - this.#start_n) + this.#start_n;
    }
  }

  current (): number {
    if (this.startTime === NOT_STARTED && this.type !== "Normal"){
      return this.isInt ? Math.floor(this.#start_n) : this.#start_n;
    }

    const currentTime = Date.now();

    const elapsed = currentTime - this.startTime;
    const t = Math.min(Math.max(elapsed / this.time, 0), 1);

    const progress = this.#calcValue(t);
    return this.isInt ? Math.floor(progress) : progress;
  }

  reset (){
    this.startTime = NOT_STARTED;
  }
}
