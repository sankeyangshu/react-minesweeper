import * as React from 'react';

declare module 'react' {
  //tsx标签写uno不报错
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    flex?: boolean;
    relative?: boolean;
    text?: string;
    grid?: boolean;
    before?: string;
    after?: string;
    shadow?: boolean;
    w?: string;
    h?: string;
    bg?: string;
    rounded?: string;
    fixed?: boolean;
    b?: string;
    z?: string;
    block?: boolean;
    'focus:shadow'?: boolean;
  }
  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    w?: string;
    h?: string;
  }
}
