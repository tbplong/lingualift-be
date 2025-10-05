/* eslint-disable @typescript-eslint/no-unused-expressions */
export class Lock<T> {
  private _isAcquired: boolean = false;
  private _acquiredMap: Map<T, boolean> = new Map<T, boolean>();
  private waitingMap: Map<T, (() => void)[]> = new Map<T, (() => void)[]>();
  private waitingList: (() => void)[] = [];

  async acquire(key?: T): Promise<void> {
    if (key) {
      if (!this._acquiredMap.has(key) || !this._acquiredMap.get(key)) {
        this._acquiredMap.set(key, true);
        return Promise.resolve();
      }
    } else if (!this._isAcquired) {
      this._isAcquired = true;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      if (key) {
        if (this.waitingMap.has(key)) {
          const resolvers = this.waitingMap.get(key);
          if (resolvers === undefined) return;
          resolvers.push(resolve);
          this.waitingMap.set(key, resolvers);
        } else {
          this.waitingMap.set(key, [resolve]);
        }
      } else {
        this.waitingList.push(resolve);
      }
    });
  }

  isAcquired(key?: T): boolean {
    if (key) {
      if (!this._acquiredMap.has(key)) {
        return false;
      }
      const temp = this._acquiredMap.get(key);
      return temp || false;
    }
    return this._isAcquired;
  }

  release(key?: T): void {
    if (key) {
      const acquireMapValue = this._acquiredMap.get(key);
      const waitingMapValue = this.waitingMap.get(key);
      if (!this._acquiredMap.has(key) || !acquireMapValue) {
        throw new Error(`Please acquire a lock before releasing!!`);
      } else if (waitingMapValue && waitingMapValue.length > 0) {
        const resolve = waitingMapValue.shift();
        resolve && resolve();
      } else {
        if (this.waitingMap.has(key)) {
          this.waitingMap.delete(key);
        }

        this._acquiredMap.set(key, false);
      }
    } else if (!this._isAcquired) {
      throw new Error('Please acquire a lock before releasing!!');
    } else if (this.waitingList.length > 0) {
      const resolve = this.waitingList.shift();
      resolve && resolve();
    } else {
      this._isAcquired = false;
    }
  }
}
