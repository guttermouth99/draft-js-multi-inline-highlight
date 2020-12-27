export class Fragmenter {
  constructor(styles) {
    this.data = Object.keys(styles).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});
  }
  getDecoratedRanges() {
    const result = [];
    const ranges = this.getAbsoluteRanges();
    for (const range of ranges) {
      result.push(this.getStylesForRange(range));
    }
    return result;
  }
  isMultiply() {
    return (
      Object.keys(this.data).reduce((acc, key) => {
        acc += this.data[key].length > 0 ? 1 : 0;
        return acc;
      }, 0) > 1
    );
  }
  getSimpleRanges() {
    for (const key of Object.keys(this.data)) {
      if (this.data[key].length > 0) {
        return {
          range: this.data[key],
          style: key,
        };
      }
    }
  }
  add(nick, range) {
    if (!this.data[nick]) {
      throw Error(`Style ${nick} is undefined`);
    }
    this.data[nick].push(range);
  }
  getAbsoluteRanges() {
    let merged = [];
    for (const key of Object.keys(this.data)) {
      merged = merged.concat(...this.data[key]);
    }
    const ranges = [...new Set([...merged])].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < ranges.length - 1; i++) {
      result.push([ranges[i], ranges[i + 1]]);
    }
    return result;
  }
  getStylesForRange(range) {
    const start = range[0];
    const end = range[1];
    const styles = [];
    for (const key of Object.keys(this.data)) {
      if (this.data[key]) {
        for (const r of this.data[key]) {
          if (
            (start >= r[0] && end <= r[1]) ||
            (r[0] >= start && r[1] <= end)
          ) {
            styles.push(key);
            break;
          }
        }
      }
    }
    return {
      range: [start, end],
      styles,
    };
  }
}
