// chessboard: Custom Elements Define Library, ES Module/ES5 Target
import { defineCustomElement } from './chessboard.core.js';
import {
  ChessBoard,
  ContextMenu,
  CustomParagraph
} from './chessboard.components.js';

export function defineCustomElements(window, opts) {
  defineCustomElement(window, [
    ChessBoard,
    ContextMenu,
    CustomParagraph
  ], opts);
}