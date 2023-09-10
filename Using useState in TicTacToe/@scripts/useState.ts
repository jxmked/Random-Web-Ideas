/**
 * For Demo - TypeScript - React Like - useState Function
 * */

function useState(param: any, def?: any) {
  let value: any = null;

  /**
   * Use Second Parameter as default value if the
   * first parameter is function
   * */
  if ({}.toString.call(param) === "[object Function]" && def !== void 0) {
    value = def;
  } else {
    value = param;
  }

  let setValue: Function | { [id: string]: Function };
  let onChange: Function = () => {};
  let mainSetValue: any = (...args: any) => {
    // Set Value
    let res: any = null;
    if ({}.toString.call(setValue) === "[object Function]") {
      // Function
      // @ts-expect-error
      res = setValue(...args);
      onChange(value);
      return res;
    } else {
      // if useState is set to array
      return setValue;
    }
  };

  if (typeof param == "string" || param instanceof String) {
    // String
    setValue = (arg: any) => {
      value = arg;
    };
  } else if (Number(param) === param) {
    // Number
    setValue = (arg: any) => {
      try {
        let num: number = Number(arg);
        if (num == NaN) {
          throw new Error("");
        }

        value = num;
      } catch (e: any) {
        throw new Error("useState() has been set to use number");
      }
    };
  } else if (param.constructor === Object) {
    // Dictionary
    setValue = (...args: any) => {
      const [key, val] = args;
      if (
        !(typeof key == "string" || key instanceof String) &&
        Number(key) !== key
      ) {
        throw new Error(
          "useState() has been set to Object. Only String and Numbers are valid as keys",
        );
      }
      value[key] = val;
    };
  } else if (param === true || param === false) {
    // Boolean
    setValue = (arg: any) => {
      if (!(arg === true || arg === false)) {
        throw new Error("useState() has been set to use boolean");
      }

      value = arg;
    };
  } else if (param.constructor === Array) {
    // Array
    setValue = {
      push: (...args: any) => {
        let res: any = value.push(...args);
        onChange();
        return res;
      },
      splice: (...args: any) => {
        let res: any = value.splice(...args);
        onChange();
        return res;
      },
      pop: (...args: any) => {
        let res: any = value.pop(...args);
        onChange();
        return res;
      },
      shift: (...args: any) => {
        let res: any = value.shift(...args);
        onChange();
        return res;
      },
      unshift: (...args: any) => {
        let res: any = value.unshift(...args);
        onChange();
        return res;
      },
    };

    Object.freeze(setValue);
    mainSetValue = setValue;
  } else if ({}.toString.call(param) === "[object Function]") {
    // Function
    setValue = (...args: any) => {
      value = param(value, ...args);
    };
  } else {
    setValue = (arg: any) => {
      value = arg;
    };
  }

  return [
    () => value, // Get Value
    mainSetValue,
    (callback: Function) => (onChange = callback), // On Change Value
  ];
}

/**
 * Written By Jovan De Guia
 * Project Name: useState Demo -Tic Tac Toe
 * Github: jxmked
 * */
