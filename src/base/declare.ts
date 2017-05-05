import * as lang from "./lang";
import * as kernel from "./kernel";

// 此方法来源与 dojo.declare
// declare
var xtor = function () { };
var op = Object.prototype, opts = op.toString, cname = "constructor";

// forceNew(ctor)
// 返回一个新的对象
// return a new object that inherits from ctor.prototype but
// without actually running ctor on the object.
function forceNew(ctor) {
  // create object with correct prototype using a do-nothing
  // constructor
  xtor.prototype = ctor.prototype;
  var t = new xtor;
  xtor.prototype = null;	// clean up
  return t;
}

// applyNew(args)
// just like 'new ctor()' except that the constructor and its arguments come
// from args, which must be an array or an arguments object
function applyNew(args) {
  // create an object with ctor's prototype but without
  // calling ctor on it.
  var ctor = args.callee, t = forceNew(ctor);
  // execute the real constructor on the new object
  ctor.apply(t, args);
  return t;
}
// chained constructor compatible with the legacy declare()
function chainedConstructor(bases, ctorSpecial) {
  return function () {
    var a = arguments, args = a, a0 = a[0], f, i, m,
      l = bases.length, preArgs;

    if (!(this instanceof a.callee)) {
      // not called via new, so force it
      return applyNew(a);
    }

    //this._inherited = {};
    // perform the shaman's rituals of the original declare()
    // 1) call two types of the preamble
    if (ctorSpecial && (a0 && a0.preamble || this.preamble)) {
      // full blown ritual
      preArgs = new Array(bases.length);
      // prepare parameters
      preArgs[0] = a;
      for (i = 0; ;) {
        // process the preamble of the 1st argument
        a0 = a[0];
        if (a0) {
          f = a0.preamble;
          if (f) {
            a = f.apply(this, a) || a;
          }
        }
        // process the preamble of this class
        f = bases[i].prototype;
        f = f.hasOwnProperty("preamble") && f.preamble;
        if (f) {
          a = f.apply(this, a) || a;
        }
        // one peculiarity of the preamble:
        // it is called if it is not needed,
        // e.g., there is no constructor to call
        // let's watch for the last constructor
        // (see ticket #9795)
        if (++i == l) {
          break;
        }
        preArgs[i] = a;
      }
    }
    // 2) call all non-trivial constructors using prepared arguments
    for (i = l - 1; i >= 0; --i) {
      f = bases[i];
      m = f._meta;
      f = m ? m.ctor : f;
      if (f) {
        f.apply(this, preArgs ? preArgs[i] : a);
      }
    }
    // 3) continue the original ritual: call the postscript
    f = this.postscript;
    if (f) {
      f.apply(this, args);
    }
  };
}


// chained constructor compatible with the legacy declare()
function singleConstructor(ctor, ctorSpecial) {
  return function () {
    var a = arguments, t = a, a0 = a[0], f;

    //if (!(this instanceof a.callee)) {
    //if (true) {
    // not called via new, so force it
    //  return applyNew(a);
    //}

    //this._inherited = {};
    // perform the shaman's rituals of the original declare()
    // 1) call two types of the preamble
    if (ctorSpecial) {
      // full blown ritual
      if (a0) {
        // process the preamble of the 1st argument
        f = a0.preamble;
        if (f) {
          t = f.apply(this, t) || t;
        }
      }
      f = this.preamble;
      if (f) {
        // process the preamble of this class
        f.apply(this, t);
        // one peculiarity of the preamble:
        // it is called even if it is not needed,
        // e.g., there is no constructor to call
        // let's watch for the last constructor
        // (see ticket #9795)
      }
    }
    // 2) call a constructor
    if (ctor) {
      ctor.apply(this, a);
    }
    // 3) continue the original ritual: call the postscript
    f = this.postscript;
    if (f) {
      f.apply(this, a);
    }
  };
}

// plain vanilla constructor (can use inherited() to call its base constructor)
function simpleConstructor(bases) {
  return function () {
    var a = arguments, i = 0, f, m;

    if (!(this instanceof a.callee)) {
      // not called via new, so force it
      return applyNew(a);
    }

    //this._inherited = {};
    // perform the shaman's rituals of the original declare()
    // 1) do not call the preamble
    // 2) call the top constructor (it can use this.inherited())
    for (; f = bases[i]; ++i) { // intentional assignment
      m = f._meta;
      f = m ? m.ctor : f;
      if (f) {
        f.apply(this, a);
        break;
      }
    }
    // 3) call the postscript
    f = this.postscript;
    if (f) {
      f.apply(this, a);
    }
  };
}

function chain(name, bases, reversed) {
  return function () {
    var b, m, f, i = 0, step = 1;
    if (reversed) {
      i = bases.length - 1;
      step = -1;
    }
    for (; b = bases[i]; i += step) { // intentional assignment
      m = b._meta;
      f = (m ? m.hidden : b.prototype)[name];
      if (f) {
        f.apply(this, arguments);
      }
    }
  };
}

/*#region 函数:declare(object)*/
/**
* 声明对象
* @method declare
* @memberof x
* @returns {object} 声明的对象
*/
var declare = function (className?, superclass?, props?) {
  // 处理参数
  var className, superclass, props;

  if (arguments.length == 1) {
    // 一个参数
    className = null;
    superclass = null;
    props = arguments[0] || {};
  } else if (arguments.length == 2) {
    // 两个参数
    if (lang.isString(arguments[0])) {
      className = arguments[0] || {};
      superclass = null;
      props = arguments[1] || {};
    }
    else {
      className = null;
      superclass = arguments[0] || {};
      props = arguments[1] || {};
    }
  } else if (arguments.length == 3) {
    className = arguments[0];
    superclass = arguments[1] || {};
    props = arguments[2] || {};
  }

  // 定义变量
  var proto, t, ctor;

  // 定义一个空的对象
  ctor = function () { };

  // 定义 prototype
  proto = {};

  if (lang.isArray(superclass)) {
    // 多个类继承
    for (var i = 0; i < superclass.length; i++) {
      lang.extend(proto, superclass[i]);
    }
  }
  else if (superclass != null) {
    lang.extend(proto, superclass);
  }

  // target = lang.ext(target, props);
  for (var property in props) {
    ctor.prototype[property] = props[property];
    lang.extend(proto, props);
  }

  // add constructor
  // 添加构造函数
  t = props.constructor;
  if (t !== op.constructor) {
    t.nom = cname;
    proto.constructor = t;
  }

  // collect chains and flags

  //build ctor
  // 构建类的构造函数

  // ctor.prototype.constructor = props.constructor ? props.constructor : lang.noop;
  // t = !chains || !chains.hasOwnProperty(cname);
  // bases[0] = ctor = (chains && chains.constructor === "manual") ? simpleConstructor(bases) :
  //  (bases.length == 1 ? singleConstructor(props.constructor, t) : chainedConstructor(bases, t));
  ctor = singleConstructor(props.constructor, t);

  // add meta information to the constructor
  ctor._meta = {
    // bases: bases,
    hidden: props,
    // chains: chains,
    // parents: parents,
    ctor: props.constructor
  };
  ctor.superclass = superclass && superclass.prototype;
  // ctor.extend = extend;
  // ctor.createSubclass = createSubclass;
  ctor.prototype = proto;
  proto.constructor = ctor;

  if (className) {
    // props.declaredClass = className;
    ctor.prototype.declaredClass = className;

    // 设置对象到注册的位置
    let parts = className.split(".");
    let name = parts.pop();

    let context = parts.length == 0 ? kernel.global() : kernel.register(parts.join('.'));

    context[name] = ctor;
  }

  return ctor;
}
/*#endregion*/

export = declare;
