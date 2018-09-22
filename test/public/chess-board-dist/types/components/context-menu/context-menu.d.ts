import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
interface iHeader {
    header: string;
}
interface iMenu {
    x: number;
    y: number;
    menuDisplay: string;
}
export declare class ContextMenu implements iMenu, iHeader {
    items: number;
    x: number;
    y: number;
    menuDisplay: string;
    ovlBg: string;
    header: string;
    footer: string;
    closeMenu: EventEmitter;
    render(): JSX.Element;
}
export {};
