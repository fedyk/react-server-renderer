export type Props = Record<string, any>

export type FC<P extends Props = any> = (props: P) => any;

export enum ElementTypes {
  Empty,
  Text,
  Tag,
  Component,
  Fragment,
}

interface EmptyElement {
  type: ElementTypes.Empty;
  target?: Node;
}

interface TextElement {
  type: ElementTypes.Text;
  target?: Node;
  value: string;
}

interface TagElement {
  type: ElementTypes.Tag;
  tag: string;
  props: Props;
  children: Children;
}

interface ComponentElement {
  type: ElementTypes.Component;
  Component: FC;
  props: Props;
  children: Children;
}

interface FragmentElement {
  type: ElementTypes.Fragment;
  children: Children;
}

export type Element =
  EmptyElement
  | TextElement
  | TagElement
  | ComponentElement
  | FragmentElement;

export type ParentElement =
  TagElement
  | ComponentElement
  | FragmentElement;

type Children = Element[];

// Compatibility with JSX types
export type Node =
  | string
  | number
  | boolean
  | Node[];

const Fragment = Symbol("Fragment");

const selfClosingTags = new Set([
  "area", "base", "img", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"
])

function isTagElement($element: Element): $element is TagElement {
  return $element.type === ElementTypes.Tag;
}

function isComponentElement($element: Element): $element is ComponentElement {
  return $element.type === ElementTypes.Component;
}

function isFragmentElement($element: Element): $element is FragmentElement {
  return $element.type === ElementTypes.Fragment;
}

function isParentElement($element: Element): $element is ParentElement {
  return isTagElement($element) || isComponentElement($element) || isFragmentElement($element);
}

function createElement(
  source: string | FC | typeof Fragment,
  props: Props,
  ...children: any[]
): ParentElement | Children {
  children = children.flat();

  if (source === Fragment) {
    return buildFragmentElement(children);
  }

  if (typeof source === 'function') {
    return createComponentInstance(source, props || {}, children);
  }

  return buildTagElement(source, props || {}, children);
}

function buildFragmentElement(children: any[]): FragmentElement {
  return {
    type: ElementTypes.Fragment,
    children: dropEmptyTail(children, true).map(buildChildElement),
  };
}

function createComponentInstance(Component: FC, props: Props, children: any[]): ComponentElement {
  return {
    type: ElementTypes.Component,
    Component: Component,
    props: props,
    children: dropEmptyTail(children, true).map(buildChildElement),
  }
}

function buildTagElement(tag: string, props: Props, children: any[]): TagElement {
  return {
    type: ElementTypes.Tag,
    tag,
    props,
    children: dropEmptyTail(children).map(buildChildElement),
  };
}

function dropEmptyTail(children: any[], noEmpty = false) {
  let i = children.length - 1;

  for (; i >= 0; i--) {
    if (!isEmptyPlaceholder(children[i])) {
      break;
    }
  }

  if (i === children.length - 1) {
    return children;
  }

  if (i === -1 && noEmpty) {
    return children.slice(0, 1);
  }

  return children.slice(0, i + 1);
}

function isEmptyPlaceholder(child: any) {
  return child === false || child === null || child === undefined;
}

function buildChildElement(child: any): Element {
  if (isEmptyPlaceholder(child)) {
    return buildEmptyElement();
  } else if (isParentElement(child)) {
    return child;
  } else {
    return buildTextElement(child);
  }
}

function buildTextElement(value: any): TextElement {
  return {
    type: ElementTypes.Text,
    value: String(value),
  };
}

function buildEmptyElement(): EmptyElement {
  return { type: ElementTypes.Empty };
}

function renderToStaticMarkup(element: Element): string {
  if (element.type === ElementTypes.Fragment) {
    let result = ""
    let i: number

    for (i = 0; i < element.children.length; i++) {
      result += renderToStaticMarkup(element.children[i])
    }

    return result
  }

  if (element.type === ElementTypes.Empty) {
    return ``
  }

  if (element?.type === ElementTypes.Text) {
    return escape(element.value)
  }

  if (element?.type === ElementTypes.Tag) {
    let el = `<${element.tag}`
    let attrs = ""
    let name: string
    let value: string

    for (name in element.props) {
      if (Object.hasOwn(element.props, name)) {
        value = String(element.props[name] || "")

        if (name === "className") {
          name = "class"
        }

        attrs += `${escape(name)}="${escape(value)}" `
      }
    }

    if (attrs.length > 0) {
      el += " " + attrs.trim()
    }

    if (selfClosingTags.has(element.tag)) {
      return el + "/>"
    }

    el += ">"

    let i: number

    for (i = 0; i < element.children.length; i++) {
      el += renderToStaticMarkup(element.children[i])
    }

    el += `</${element.tag}>`

    return el
  }

  if (element.type === ElementTypes.Component) {
    return renderToStaticMarkup(element.Component(Object.assign({}, element.props, {
      children: element.children
    })))

  }

  return ""
}

const escapeMap: Record<string, string> = {
  "&": "&amp;",
  "\"": "&quot;",
  "\'": "&apos;",
  "<": "&lt;",
  ">": "&gt;"
}

function escape(str: string) {
  return str.replace(/[&"'<>]/g, function (char) {
    return escapeMap[char]
  })
}

export default {
  createElement,
  Fragment,
  renderToStaticMarkup
}
