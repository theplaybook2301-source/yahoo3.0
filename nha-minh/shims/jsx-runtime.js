const React = window.React;
function jsx(type, props, key) {
  const { children, ...rest } = props || {};
  if (key !== undefined) rest.key = key;
  return Array.isArray(children) ? React.createElement(type, rest, ...children) : children !== undefined ? React.createElement(type, rest, children) : React.createElement(type, rest);
}
module.exports = { jsx, jsxs: jsx, Fragment: React.Fragment };
