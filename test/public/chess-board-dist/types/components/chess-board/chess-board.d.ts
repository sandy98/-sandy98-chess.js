import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { Game } from '../../lib/game';
interface IBoardModes {
    MODE_ANALYSIS: string;
    MODE_PLAY: string;
    MODE_SETUP: string;
    MODE_VIEW: string;
}
interface ISchema {
    light: string;
    dark: string;
}
interface ISchemas {
    brown: ISchema;
    blue: ISchema;
    acqua: ISchema;
    green: ISchema;
}
interface IFigurine {
    codePoint: string;
    html: string;
}
interface IFigurines {
    p: IFigurine;
    n: IFigurine;
    b: IFigurine;
    r: IFigurine;
    q: IFigurine;
    k: IFigurine;
    P: IFigurine;
    N: IFigurine;
    B: IFigurine;
    R: IFigurine;
    Q: IFigurine;
    K: IFigurine;
}
interface IFenObj {
    pos: string;
    fenPos: string;
    turn: string;
    castling: string;
    enPassant: string;
    halfMoveClock: number;
    fullMoveNumber: number;
}
export declare class ChessBoard {
    static boardModes: IBoardModes;
    static schemas: ISchemas;
    static figurines: IFigurines;
    version: string;
    useFigurines: boolean;
    sets: object;
    set: string;
    validateSet(newValue: string, oldValue: string): void;
    id: string;
    initialFen: string;
    game: Game;
    initialFlipped: boolean;
    initialMode: string;
    humanSide: string;
    highLightBg: string;
    autoPromotion: string;
    initialLightBgColor: string;
    initialDarkBgColor: string;
    trashbin: string;
    sqFrom: number;
    sqTo: number;
    figureFrom: string;
    isDragging: boolean;
    boardMode: string;
    testMode(newValue: string, oldValue: string): void;
    flipped: boolean;
    isMounted: boolean;
    boardHeight: number;
    lightBgColor: string;
    darkBgColor: string;
    current: number;
    setupObj: IFenObj;
    castlingPermissions: string[];
    isPromoting: boolean;
    menuX: number;
    menuY: number;
    menuDisplay: string;
    flipEvent: EventEmitter;
    moveEvent: EventEmitter;
    onCloseMenu(): void;
    handleResize(): void;
    keybdHandler(ev: KeyboardEvent): void;
    handleReorientation(): void;
    handleMoveEvent(mEv: CustomEvent): void;
    componentDidLoad(): void;
    setEngine(game?: Game): boolean;
    getEngine(): string;
    getGame(): object;
    getCurrent(): number;
    getMode(): string;
    getPgnMoves(): string;
    undo(): boolean;
    analyze(): void;
    play(): void;
    setup(): void;
    view(): void;
    goto(n: number): void;
    _getWhat(what?: string, n?: number): string;
    getPos(n?: number): string;
    getFenPos(n?: number): string;
    getTurn(n?: number): string;
    getCastling(n?: number): string;
    getEnPassant(n?: number): string;
    getHalfMoveClock(n?: number): string;
    getFullMoveNumber(n?: number): string;
    setBg(light: string, dark: string): void;
    setSchema(schema?: string): void;
    resetGame(fen?: string): void;
    empty(): void;
    default(): void;
    getInitialFen(): string;
    flip(): void;
    isFlipped(): boolean;
    rerender(): void;
    getBoardHeight(): number;
    canStartHere(figure: string): boolean;
    canEndHere(square: number): boolean;
    getMaxPos(): number;
    setSquare(square: number, figure: string): void;
    tryRemoteMove(san: string): boolean;
    onDragStart(figure: string, square: number, ev: DragEvent): boolean;
    onDrop(square: number, _: any): boolean;
    onSquareClick(square: number, figure: string, _: any): boolean;
    handleEndMove(sqFrom: number, sqTo: number, figure: string, promotion?: string): void;
    renderNotation(): JSX.Element[];
    renderSetup(): JSX.Element;
    renderNotationOrSetup(): JSX.Element;
    renderLateralPanel(): JSX.Element;
    renderBoard(): JSX.Element;
    renderPromotionPanel(): JSX.Element;
    renderMenuPanel(): JSX.Element;
    render(): JSX.Element;
}
export {};
