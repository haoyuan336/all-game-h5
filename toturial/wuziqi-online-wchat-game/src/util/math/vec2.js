class Vec2 {
  constructor() {
    this.x = 0
    this.y = 0
    if (arguments.length === 2) {
      this.x = arguments[0]
      this.y = arguments[1]
    }
  }
  set() {
    if (arguments.length === 0) {
      return
    }
    if (arguments.length === 1) {
      this.x = arguments[0]
      this.y = arguments[0]
    } else {
      this.x = arguments[0]
      this.y = arguments[1]
    }
  }
  sub() {
    let v = new Vec2(this.x, this.y)
    if (arguments.length === 1) {
      v.x -= arguments[0].x,
        v.y -= arguments[0].y
    } else {
      v.x -= arguments[0];
      v.y -= arguments[1];
    }
    return v
  }
  add() {
    let v = new Vec2(this.x, this.y)

    if (arguments.length === 1) {
      v.x += arguments[0].x;
      v.y += arguments[0].y;
    } else {
      v.x += arguments[0];
      v.y += arguments[1];
    }


    return v
  }
  isZero() {
    if (this.x === 0 && this.y === 0) {
      return true
    }
    return false
  }
  rotation(object, angle) {
    // 向量转一个角度
    let sinAngle = Math.sin(angle)
    let cosAngle = Math.cos(angle)
    let x = 0
    let y = 0
    if (object.isZero()) {
      // console.log('旋转点是0');
      let tempX = this.x * cosAngle - this.y * sinAngle
      y = this.y * cosAngle + this.x * sinAngle
      x = tempX
    } else {
      let tempX = this.x - object.x
      let tempY = this.y - object.y
      x = tempX * cosAngle - tempY * sinAngle + this.x
      y = tempY * cosAngle + tempX * sinAngle + this.y
    }

    return new Vec2(x, y)
  };
  getNormal() {
    let n = this.x * this.x + this.y * this.y
    if (n === 1) {
      return this
    }
    n = Math.sqrt(n)
    if (n < Number.MIN_VALUE) {
      return this
    }
    n = 1 / n
    let x = this.x * n
    let y = this.y * n
    return new Vec2(x, y)
  }
  multi(value) {
    return new Vec2(value * this.x, value * this.y)
  }
  distance() {
    // let l = this.x * this.x +
    let object = undefined;
    if (arguments.length == 1) {
      object = arguments[0];
    } else {
      object = {
        x: arguments[0],
        y: arguments[1]
      }
    }
    let a = (this.x - object.x) * (this.x - object.x) + (this.y - object.y) * (this.y - object.y)
    let l = Math.sqrt(a)
    let w = parseInt(l)
    if (l - w < 0.00001) {
      return w
    }

    return l
  }
  // getAngle() {
  //   let vec = undefined;
  //   if (arguments.length == 1) {
  //     vec = new Vec2(arguments[0].x, arguments[0].y);
  //   } else {
  //     vec = new Vec2(arguments[0], arguments[1]);
  //   }
  //   let cross = vec.x * this.x + vec.y * this.y;
  //   let multi = Math.sqrt(vec.x * vec.x + vec.y * vec.y) * Math.sqrt(this.x * this.x  + this.y * this.y);
  //   let angle = Math.acos(cross / multi);
  //   return angle;
  // }


  cross() {
    //向量积
    let object = undefined;
    if (arguments.length == 1) {
      object = {
        x: arguments[0].x,
        y: arguments[0].y
      }
    } else {
      object = {
        x: arguments[0],
        y: arguments[1]
      }
    }
    return this.x * object.y - this.y * object.x;
  }
  dot() {
    //点积
    let object = undefined;
    if (arguments.length == 1) {
      object = {
        x: arguments[0].x,
        y: arguments[0].y
      }
    } else {
      object = {
        x: arguments[0],
        y: arguments[1]
      }
    }
    return this.x * object.x + this.y * object.y;
  }
  getRadians() {
    //得到向量弧度
    let object = undefined;
    if (arguments.length == 1) {
      object = {
        x: arguments[0].x,
        y: arguments[0].y
      }
    } else {
      object = {
        x: arguments[0],
        y: arguments[1]
      }
    }

    let v = new Vec2(object.x, object.y);
    let a = this.getNormal();
    let b = v.getNormal();

    let angle = Math.atan2(a.cross(b), a.dot(b));
    // console.log('angle = ' + angle);
    if (Math.abs(angle) < Number.MIN_VALUE) {
      return 0
    }
    return angle;
  };
}
export default Vec2
