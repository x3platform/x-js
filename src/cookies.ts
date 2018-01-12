import * as lang from "./base/lang";

declare function unescape(s:string): string;
declare function escape(s:string): string;

/**
* @namespace cookies
* @memberof x
* @description Cookies 管理
*/
let self = {

  /*#region 函数:query(name)*/
  /**
  * 根据 Cookie 名称查找相关的值
  * @method query
  * @memberof x.cookies
  * @param {string} name 名称
  */
  query: function(name)
  {
    var value = '';
    var search = name + '=';

    if(document.cookie.length > 0)
    {
      var offset = document.cookie.indexOf(search);

      if(offset != -1)
      {
        offset += search.length;

        var end = document.cookie.indexOf(';', offset);

        if(end == -1) { end = document.cookie.length; }

        value = unescape(document.cookie.substring(offset, end));
      }
    }

    return value;
  },
  /*#endregion*/

  /*#region 函数:add(name, value, options)*/
  /**
  * 新增 Cookie 的值
  * @method add
  * @memberof x.cookies
  * @param {string} name 名称
  * @param {string} value 值
  * @param {object} [options] 选项<br />
  * 可选键值范围:
  * <table class="param-options" >
  * <thead>
  * <tr><th>名称</th><th>类型</th><th class="last" >描述</th></tr>
  * </thead>
  * <tbody>
  * <tr><td class="name" >expire</td><td>string</td><td>过期时间</td></tr>
  * <tr><td class="name" >path</td><td>string</td><td>所属的路径</td></tr>
  * <tr><td class="name" >domain</td><td>string</td><td>所属的域</td></tr>
  * </tbody>
  * </table>
  * @example
  * // 新增一条 Cookie 记录,
  * // 名称为 CookieName1, 值为 CookieValue1
  * x.cookie.add('CookieName1', 'CookieValue1');
  * @example
  * // 新增一条 Cookie 记录,
  * // 名称为 CookieName2, 值为 CookieValue2,
  * // 过期时间为 2050-1-1 10:30:00
  * x.cookie.add('cookieName2', 'cookieValue2', {'expire': new (2050, 1, 1, 10, 30, 00)});
  * @example
  * // 新增一条 Cookie 记录,
  * // 名称为 CookieName3, 值为 CookieValue3,
  * // 过期时间为 2050-1-1 10:30:00 , 所属路径为 /help/
  * x.cookies.add('cookieName3', 'cookieValue3', {'expire': new (2050,1,1,10,30,00), path: '/help/'});
  * @example
  * // 新增一条 Cookie 记录,
  * // 名称为 CookieName4, 值为 CookieValue4,
  * // 过期时间为 2050-1-1 10:30:00, 所属的域为 github.com
  * x.cookies.add('cookieName4', 'cookieValue4', {'expire': new (2050,1,1,10,30,00), path: '/', domain: 'github.com');
  */
  add: function(name, value, options)
  {
    options = lang.extend({ path: '/' }, options || {});

    document.cookie = escape(name) + '=' + escape(value)
        + ((!options.expire) ? '' : ('; expires=' + options.expire.toUTCString()))
        + '; path=' + options.path
        + ((!options.domain) ? '' : ('; domain=' + options.domain));
  },
  /*#endregion*/

  /*#region 函数:remove(name, options)*/
  /**
  * 移除 Cookie 的值
  * @method remove
  * @memberof x.cookies
  * @param {string} name 名称
  * @param {object} [options] 选项<br />
  * 可选键值范围:
  * <table class="param-options" >
  * <thead>
  * <tr><th>名称</th><th>类型</th><th class="last" >描述</th></tr>
  * </thead>
  * <tbody>
  * <tr><td class="name" >path</td><td>string</td><td>所属的路径</td></tr>
  * <tr><td class="name" >domain</td><td>string</td><td>所属的域</td></tr>
  * </tbody>
  * </table>
  * @example
  * // 移除一条 Cookie 记录, 名称为 CookieName1
  * x.cookies.remove('CookieName1');
  * @example
  * // 移除一条 Cookie 记录, 名称为 CookieName2
  * x.cookies.remove('CookieName2', {path: '/help/'});
  */
  remove: function(name, options)
  {
    options = lang.extend({ path: '/' }, options || {});

    if(!!this.query(name))
    {
      document.cookie = escape(name) + '=; path=' + options.path
          + '; expires=' + new Date(0).toUTCString()
          + ((!options.domain) ? '' : ('; domain=' + options.domain));
    }
  }
  /*#endregion*/
};

export = self;
