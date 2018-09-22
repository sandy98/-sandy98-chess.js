import chessSets from 'chess-sets';
import { Game } from '../../lib/game';
//import { ChessGame } from '../../lib/game'
const getUuid = () => new Date().getTime().toString(16);
export class ChessBoard {
    constructor() {
        this.version = '0.1.0';
        this.useFigurines = true;
        this.sets = chessSets;
        this.set = 'default';
        this.id = getUuid();
        this.game = new Game(this.getInitialFen());
        //@Prop({mutable: true}) realGame: object = new ChessGame(this.getInitialFen())
        this.initialFlipped = false;
        this.initialMode = ChessBoard.boardModes.MODE_ANALYSIS;
        this.humanSide = 'w';
        this.highLightBg = '#bfd';
        this.autoPromotion = null;
        this.trashbin = 'data:image/jpeg;base64,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';
        this.sqFrom = -1;
        this.sqTo = -1;
        this.figureFrom = null;
        this.isDragging = false;
        this.boardMode = this.initialMode;
        this.flipped = this.initialFlipped;
        this.isMounted = false;
        this.boardHeight = 320;
        this.lightBgColor = this.initialLightBgColor || ChessBoard.schemas.blue.light;
        this.darkBgColor = this.initialDarkBgColor || ChessBoard.schemas.blue.dark;
        this.current = 0;
        this.setupObj = null;
        this.isPromoting = false;
        this.menuX = 0;
        this.menuY = 0;
        this.menuDisplay = 'none';
    }
    validateSet(newValue, oldValue) {
        if (!(newValue in chessSets)) {
            //console.log(newValue + " is an invalid value for set property")
            this.set = oldValue;
        }
        else {
            this.set = newValue;
        }
    }
    testMode(newValue, oldValue) {
        if (!(newValue in ChessBoard.boardModes)) {
            //console.log(`${newValue} is not an accepted board mode.`)
            this.boardMode = oldValue;
        }
    }
    onCloseMenu() {
        this.menuDisplay = 'none';
    }
    handleResize() {
        this.flip();
        this.flip();
    }
    keybdHandler(ev) {
        switch (ev.keyCode) {
            case 36: //Home
                ev.preventDefault();
                this.goto(0);
                break;
            case 35: //End
                ev.preventDefault();
                this.goto(this.getMaxPos());
                break;
            case 33: // PageUp
                ev.preventDefault();
                this.goto(this.getCurrent() - 10);
                break;
            case 34: //PageDown
                ev.preventDefault();
                this.goto(this.getCurrent() + 10);
                break;
            case 37: // ArrowLeft
                ev.preventDefault();
                this.goto(this.getCurrent() - 1);
                break;
            case 39: //ArrowRight
                ev.preventDefault();
                this.goto(this.getCurrent() + 1);
                break;
            default:
            //do Nothing
        }
    }
    handleReorientation() {
        this.flip();
        this.flip();
    }
    handleMoveEvent(mEv) {
        console.log(`Move: ${mEv.detail.toString()}`);
        //console.log(this.game.pgn())
        this['notationElement'].scrollTop = this['notationElement'].scrollHeight;
    }
    componentDidLoad() {
        //console.log("Board loaded")
        const keybdHandler = (ev) => {
            /*
            console.log("")
            console.log("code: " + ev.code)
            console.log("chrCode: " + ev.charCode)
            console.log("key: " + ev.key)
            console.log("keyCode: " + ev.keyCode)
            */
            ev.preventDefault();
            switch (ev.keyCode) {
                case 36: //Home
                    this.goto(0);
                    break;
                case 35: //End
                    this.goto(this.getMaxPos());
                    break;
                case 33: // PageUp
                    this.goto(this.getCurrent() - 10);
                    break;
                case 34: //PageDown
                    this.goto(this.getCurrent() + 10);
                    break;
                case 37: // ArrowLeft
                    this.goto(this.getCurrent() - 1);
                    break;
                case 39: //ArrowRight
                    this.goto(this.getCurrent() + 1);
                    break;
                default:
                //do Nothing
            }
        };
        this[`${this.id}-main`]['addEventListener']('keydown', keybdHandler);
        this.isMounted = true;
        this.boardMode = this.initialMode;
        this.validateSet(this.set, 'default');
        this.rerender();
        this.resetGame();
    }
    setEngine(game = new Game()) {
        if (typeof game['move'] === 'undefined')
            return false; // Test by "duck typing"
        this.game = game;
        this.current = 0;
        this.flip();
        this.flip();
        return true;
    }
    getEngine() { return this.game.constructor.name; }
    getGame() { return this.game; }
    getCurrent() { return this.current; }
    getMode() { return this.boardMode; }
    getPgnMoves() { return this.game.pgnMoves(); }
    undo() {
        if (this.boardMode === ChessBoard.boardModes.MODE_PLAY)
            return false;
        let res = this.game.undo();
        if (res)
            this.goto(this.getMaxPos());
        return res;
    }
    analyze() { this.boardMode = ChessBoard.boardModes.MODE_ANALYSIS; }
    play() { this.boardMode = ChessBoard.boardModes.MODE_PLAY; }
    setup() {
        if (this.current !== this.getMaxPos())
            this.current = this.getMaxPos();
        this.setupObj = Game.fen2obj(this.game.fens[this.getMaxPos()]);
        delete (this.setupObj.fenPos);
        let castling = this.setupObj.castling;
        this.castlingPermissions = [
            castling.indexOf('K') === -1 ? '' : 'K',
            castling.indexOf('Q') === -1 ? '' : 'Q',
            castling.indexOf('k') === -1 ? '' : 'k',
            castling.indexOf('q') === -1 ? '' : 'q',
        ];
        this.boardMode = ChessBoard.boardModes.MODE_SETUP;
    }
    view() { this.boardMode = ChessBoard.boardModes.MODE_VIEW; }
    goto(n) {
        if (this.boardMode !== ChessBoard.boardModes.MODE_VIEW
            && this.boardMode !== ChessBoard.boardModes.MODE_ANALYSIS) {
            return;
        }
        this.current = n < 0
            ? 0
            : n > this.getMaxPos()
                ? this.getMaxPos()
                : n;
    }
    _getWhat(what = 'getPos', n = this.current) {
        let num = n < 0
            ? 0
            : n >= this.game.fens.length
                ? this.game.fens.length - 1
                : n;
        return this.game[what](num);
    }
    getPos(n = this.current) {
        return this.boardMode !== ChessBoard.boardModes.MODE_SETUP
            ? this._getWhat('getPos', n)
            : this.setupObj.pos;
    }
    getFenPos(n = this.current) {
        return this._getWhat('getFenPos', n);
    }
    getTurn(n = this.current) {
        return this._getWhat('getTurn', n);
    }
    getCastling(n = this.current) {
        return this._getWhat('getCastling', n);
    }
    getEnPassant(n = this.current) {
        return this._getWhat('getEnPassant', n);
    }
    getHalfMoveClock(n = this.current) {
        return this._getWhat('getHalfMoveClock', n);
    }
    getFullMoveNumber(n = this.current) {
        return this._getWhat('getFullMoveNumber', n);
    }
    setBg(light, dark) {
        this.lightBgColor = light ? light : this.lightBgColor;
        this.darkBgColor = dark ? dark : this.darkBgColor;
    }
    setSchema(schema = 'blue') {
        if (!(schema in ChessBoard.schemas))
            return;
        this.setBg(ChessBoard.schemas[schema].light, ChessBoard.schemas[schema].dark);
    }
    resetGame(fen = this.getInitialFen()) {
        this.game.reset(fen);
        this.current = 0;
        this.flip();
        this.flip();
    }
    empty() {
        this.resetGame(Game.emptyFen);
    }
    default() {
        this.resetGame(Game.defaultFen);
    }
    getInitialFen() {
        return typeof this.initialFen === 'undefined'
            ? Game.defaultFen
            : this.initialFen;
    }
    flip() {
        if (this.isPromoting)
            return;
        this.flipped = !this.flipped;
        this.flipEvent.emit(this.flipped);
    }
    isFlipped() { return this.flipped; }
    rerender() {
        //console.log("Forcing render...")
        this.render();
    }
    getBoardHeight() {
        /*
        return typeof this['boardElement'] === 'undefined'
          ? 320
          : this['boardElement']['offsetWidth']
        */
        if (this.isMounted && this['boardElement']) {
            return this.boardHeight = this['boardElement']['offsetWidth'];
        }
        else {
            return this.boardHeight = 320;
        }
    }
    canStartHere(figure) {
        if (this.boardMode === ChessBoard.boardModes.MODE_VIEW)
            return false;
        if (this.isPromoting)
            return false;
        if (figure === '0')
            return false;
        if (this.current < this.getMaxPos())
            return false;
        if (this.boardMode === ChessBoard.boardModes.MODE_SETUP)
            return true;
        if (this.boardMode === ChessBoard.boardModes.MODE_PLAY) {
            if (this.humanSide === 'w' && Game.isBlackFigure(figure))
                return false;
            if (this.humanSide === 'b' && Game.isWhiteFigure(figure))
                return false;
        }
        else {
            if (this.getTurn() === 'w' && Game.isBlackFigure(figure))
                return false;
            if (this.getTurn() === 'b' && Game.isWhiteFigure(figure))
                return false;
        }
        return true;
    }
    canEndHere(square) {
        if (this.boardMode === ChessBoard.boardModes.MODE_SETUP)
            return true;
        let figure = this.getPos()[square];
        return !Game.isFriend(this.figureFrom, figure);
    }
    getMaxPos() { return this.game.fens.length - 1; }
    setSquare(square, figure) {
        if (this.boardMode !== ChessBoard.boardModes.MODE_SETUP)
            return;
        if (!this.setupObj)
            return;
        let arrPos = this.setupObj.pos.split('');
        arrPos[square] = figure;
        this.setupObj = Object.assign({}, this.setupObj, { pos: arrPos.join('') });
    }
    tryRemoteMove(san) {
        if (this.boardMode === ChessBoard.boardModes.MODE_SETUP)
            return false;
        let bMove = this.game.move(san);
        if (bMove) {
            this.current++;
            let history = this.game.history();
            let detail = history[history.length - 1];
            this.moveEvent.emit(detail);
        }
        return bMove;
    }
    onDragStart(figure, square, ev) {
        if (!this.canStartHere(figure)) {
            ev.preventDefault();
            return false;
        }
        let size = this.boardHeight / 8;
        let pos = size / 2;
        let ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.height = size;
        ctx.canvas.width = size;
        let img = new Image();
        img.src = ev.target['src'];
        ctx.drawImage(img, 0, 0, size, size);
        ev.dataTransfer.setDragImage(ctx.canvas, pos, pos);
        this.isDragging = true;
        this.sqFrom = square;
        this.figureFrom = figure;
        return true;
    }
    onDrop(square, _) {
        if (this.isPromoting)
            return false;
        if (!this.canEndHere(square)) {
            this.sqFrom = -1;
            this.figureFrom = null;
            return false;
        }
        //console.log(`Dropped figure ${this.figureFrom} from square ${this.sqFrom} on square ${square}`)
        this.handleEndMove(this.sqFrom, square, this.figureFrom, this.autoPromotion);
        return true;
    }
    onSquareClick(square, figure, _) {
        if (this.isPromoting)
            return false;
        if (this.sqFrom === -1) {
            if (!this.canStartHere(figure)) {
                return false;
            }
            else {
                this.sqFrom = square;
                this.figureFrom = figure;
                return true;
            }
        }
        else {
            if (!this.canEndHere(square)) {
                this.sqFrom = -1;
                this.figureFrom = null;
                return false;
            }
            //console.log(`Moved figure ${this.figureFrom} from square ${this.sqFrom} to square ${square}`)
            this.handleEndMove(this.sqFrom, square, this.figureFrom, this.autoPromotion);
            return true;
        }
    }
    handleEndMove(sqFrom, sqTo, figure, promotion = this.autoPromotion) {
        if (this.boardMode === ChessBoard.boardModes.MODE_SETUP) {
            this.setSquare(sqTo, promotion ? promotion : figure);
            if (sqFrom < 64) {
                this.setSquare(sqFrom, '0');
            }
        }
        else {
            if (this.game.isPromoting(sqFrom, sqTo)) {
                if (!promotion) {
                    this.sqFrom = sqFrom;
                    this.sqTo = sqTo;
                    this.figureFrom = figure;
                    this.isPromoting = true;
                    return;
                }
                else {
                    promotion = this.getTurn() === 'b' ? promotion.toLowerCase() : promotion.toUpperCase();
                }
            }
            let bMove = this.game.move(sqFrom, sqTo, promotion);
            if (bMove) {
                this.current++;
                let history = this.game.history();
                let detail = history[history.length - 1];
                this.moveEvent.emit(detail);
            }
        }
        this.sqFrom = -1;
        this.sqTo = -1;
        this.figureFrom = null;
    }
    renderNotation() {
        let sanStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            height: '2em',
        };
        let tagStyle = {
            color: 'black',
            fontFamily: 'monospace'
        };
        let history = this.game.history({ verbose: true });
        return ([
            h("div", { style: {
                    display: this.boardMode === 'MODE_SETUP' ? 'none' : 'block',
                    paddingLeft: '1em',
                    paddingRight: '1em',
                    paddingBottom: '1em',
                    height: '25%',
                    minHeight: '25%',
                    maxHeight: '25%'
                } },
                h("custom-p", null,
                    "White",
                    h("span", { style: Object.assign({}, tagStyle) }, this.game.tags.White)),
                h("custom-p", null,
                    "Black",
                    h("span", { style: Object.assign({}, tagStyle) }, this.game.tags.Black)),
                h("custom-p", null,
                    "Result",
                    h("span", { style: Object.assign({}, tagStyle) }, this.game.tags.Result))),
            h("div", { class: "notation", ref: (el) => this['notationElement'] = el, style: {
                    display: this.boardMode === 'MODE_SETUP' ? 'none' : 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    backgroundColor: 'white',
                    width: '95%',
                    minWidth: '95%',
                    maxWidth: '95%',
                    height: '62%',
                    minHeight: '62%',
                    maxHeight: '62%',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    padding: '0.5em',
                } },
                h("div", { onClick: () => this.goto(0), style: Object.assign({}, sanStyle, { border: 'solid 1px steelblue', background: 0 === this.current ? this.lightBgColor : 'inherit' }) },
                    h("span", null, "\u00A0\u00A0\u00A0")),
                this.getPgnMoves().split('  ').filter(i => i.length).map((san, index) => {
                    let figure = history[index]['figureFrom'];
                    let promotion = history[index]['promotion'];
                    let castling = history[index]['castling'];
                    let sliced = san.replace(/^\d+\.\s+/, '').slice(1);
                    let m = san.match(/^\d+\.\s/);
                    let prefix = m ? m[0] : '';
                    return (h("div", { key: index, onClick: () => this.goto(index + 1), style: Object.assign({}, sanStyle, { background: (index + 1) === this.current ? this.lightBgColor : 'inherit' }) },
                        h("div", null, "\u00A0"),
                        this.useFigurines && !figure.match(/[Pp]/) && !castling
                            ? h("div", { style: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flexStart',
                                    alignItems: 'center'
                                } },
                                prefix,
                                h("img", { src: chessSets['default'][figure], style: { width: '1.8em', height: '1.8em' } }),
                                sliced)
                            : h("div", { style: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flexStart',
                                    alignItems: 'center'
                                }, innerHTML: promotion && this.useFigurines
                                    ? san.replace(/[NBRQ]/, `<span style="font-size: 2em; color: black;">${ChessBoard.figurines[promotion].html}</span>`)
                                    : san }),
                        h("div", null, "\u00A0")));
                }))
        ]);
    }
    renderSetup() {
        const titles = [
            'White short castling',
            'White long castling',
            'Black short castling',
            'Black long castling',
        ];
        if (!this.setupObj || !this.castlingPermissions) {
            return (h("div", { style: { display: 'none' } }));
        }
        let turn = this.setupObj ? this.setupObj.turn : this.getTurn();
        let castling = this.setupObj ? this.setupObj.castling : this.getCastling(this.current);
        const setStdPos = (which) => {
            this.setupObj = Game['fen2obj'](Game[`${which}Fen`]);
            delete (this.setupObj.fenPos);
            turn = this.setupObj.turn;
            castling = this.setupObj.castling;
            this.castlingPermissions = [
                castling.indexOf('K') === -1 ? '' : 'K',
                castling.indexOf('Q') === -1 ? '' : 'Q',
                castling.indexOf('k') === -1 ? '' : 'k',
                castling.indexOf('q') === -1 ? '' : 'q',
            ];
        };
        const setCP = (n) => {
            let value;
            if (this.castlingPermissions[n] !== '') {
                value = '';
            }
            else {
                switch (n) {
                    case 0:
                        value = 'K';
                        break;
                    case 1:
                        value = 'Q';
                        break;
                    case 2:
                        value = 'k';
                        break;
                    case 3:
                        value = 'q';
                        break;
                    default:
                        value = '';
                }
            }
            this.castlingPermissions = this.castlingPermissions.map((v, i) => {
                return i === n ? value : v;
            });
        };
        const onDropOrClick = () => {
            //console.log(`Deleting figure ${this.figureFrom} from square ${this.sqFrom}`)
            if (this.sqFrom < 64 && this.sqFrom !== -1) {
                this.setSquare(this.sqFrom, '0');
                this.sqFrom = -1;
                this.figureFrom = null;
            }
        };
        return (h("div", { class: "setup", style: {
                display: this.boardMode === 'MODE_SETUP' ? 'flex' : 'none',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: 'whitesmoke',
                width: '100%',
                minWidth: '100%',
                maxWidth: '100%',
                height: '100%',
                minHeight: '100%',
                maxHeight: '100%',
                overflowX: 'hidden',
                overflowY: 'auto',
                paddingTop: '0.5 em',
                paddingBottom: '0.5 em'
            } },
            h("div", { style: {
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                } },
                h("label", { style: { fontSize: '10pt' } }, "Add figure"),
                h("div", { style: {
                        display: 'flex',
                        flexDirection: 'column',
                        width: '180px',
                        maxWidth: '180px',
                        minWidth: '180px',
                        height: '60px',
                        maxHeight: '60px',
                        minHeight: '60px',
                        border: 'solid 1px'
                    } }, [0, 1].map((n) => {
                    return (h("div", { key: n, style: {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                            height: '30px',
                            background: n === 0 ? this.lightBgColor : this.darkBgColor
                        } }, (n === 0 ? 'pnbrqk' : 'PNBRQK').split('').map((f, i) => {
                        let key = 1000 + n * 100 + i;
                        return (h("div", { key: key, style: {
                                width: '30px',
                                height: '30px',
                                background: this.lightBgColor,
                                border: 'solid 1px lightgray'
                            }, onClick: (ev) => this.onSquareClick(key, f, ev) },
                            h("img", { style: { width: '100%', height: '100%' }, src: chessSets['default'][f], onDragStart: (ev) => this.onDragStart(f, key, ev), onDragEnd: () => this.isDragging = false })));
                    })));
                }))),
            h("div", { style: {
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '5px'
                } },
                h("label", { style: { fontSize: '10pt' } }, "Drop figure"),
                h("div", { style: {
                        width: '40px',
                        maxWidth: '40px',
                        minWidth: '40px',
                        height: '40px',
                        minHeight: '40px',
                        maxHeight: '40px',
                        border: 'solid 2px steelblue'
                    }, onDragEnter: ev => ev.preventDefault(), onDragOver: ev => ev.preventDefault(), onClick: onDropOrClick, onDrop: onDropOrClick },
                    h("img", { style: { width: '100%', height: '100%' }, src: this.trashbin, onDragStart: ev => ev.preventDefault() }))),
            h("custom-p", { style: { width: '80%' } },
                h("label", { style: { fontSize: '10pt' } }, "Turn"),
                h("div", { style: {
                        border: 'solid 1px',
                        width: '30px',
                        height: '30px',
                        background: this.lightBgColor,
                        cursor: 'pointer'
                    }, onClick: () => {
                        let newTurn = this.setupObj.turn === 'w' ? 'b' : 'w';
                        this.setupObj = Object.assign({}, this.setupObj, { turn: newTurn });
                    } },
                    h("img", { src: turn === 'w'
                            ? chessSets['default']['K']
                            : chessSets['default']['k'], style: { width: '100%', height: '100%' }, draggable: false, onDragStart: ev => ev.preventDefault() }))),
            h("custom-p", { style: { width: '80%' } },
                h("label", { style: { fontSize: '10pt' } }, "Castling permissions"),
                h("div", { style: {
                        display: 'flex',
                        flexDirection: 'row',
                        border: 'solid 1px',
                        width: '120px',
                        maxWidth: '120px',
                        minWidth: '120px'
                    } }, 'KQkq'.split('').map((fig, i) => {
                    return (h("div", { key: i, title: `${titles[i]} ${this.castlingPermissions[i] === fig ? 'allowed' : 'forbidden'}`, style: {
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            background: this.castlingPermissions[i] === fig
                                ? this.darkBgColor
                                : this.lightBgColor
                        }, onClick: () => setCP(i) },
                        h("img", { src: chessSets['default'][fig], style: { width: '100%', height: '100%' }, draggable: false, onDragStart: ev => ev.preventDefault() })));
                }))),
            h("custom-p", { style: { width: '80%' } },
                h("button", { onClick: () => {
                        setStdPos('empty');
                    } }, "Empty Board"),
                h("button", { onClick: () => {
                        setStdPos('default');
                    } }, "Default Position")),
            h("custom-p", { style: { width: '80%' } },
                h("button", { onClick: () => {
                        this.analyze();
                        this.setupObj = null;
                        this.castlingPermissions = null;
                    } }, "Cancel"),
                h("button", { onClick: () => {
                        let castling = this.castlingPermissions.join('');
                        castling = castling.length === 0 ? '-' : castling;
                        this.setupObj.castling = castling;
                        this.resetGame(Game.obj2fen(this.setupObj));
                        this.analyze();
                        this.setupObj = null;
                        this.castlingPermissions = null;
                    } }, "Save Position"))));
    }
    renderNotationOrSetup() {
        return (h("div", { class: "notation-or-setup", style: {
                height: '50%',
                minHeight: '50%',
                maxHeight: '50%',
                backgroundColor: 'white'
            } },
            this.renderNotation(),
            this.renderSetup()));
    }
    renderLateralPanel() {
        return (h("div", { class: "lateral-panel", id: `${this.id}-lateral-panel`, style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'stretch',
                background: 'lightgoldenrodyellow',
                //borderLeft: 'solid 1px',
                width: window['innerHeight'] > window['innerWidth'] ? '100%' : '40%',
                minWidth: window['innerHeight'] > window['innerWidth'] ? '100%' : '40%',
                maxWidth: window['innerHeight'] > window['innerWidth'] ? '100%' : '40%',
                height: `${this.boardHeight}px`,
                minHeight: `${this.boardHeight}px`,
                maxHeight: `${this.boardHeight}px`,
            } },
            this.renderNotationOrSetup(),
            h("div", { class: "foreign-slot", style: {
                    //height: '50%',
                    minHeight: '50%',
                    //maxHeight: '100%',
                    backgroundColor: 'lightgray',
                    overflowX: 'hidden',
                    overflowY: 'auto'
                } },
                h("slot", null))));
    }
    renderBoard() {
        //console.log('boardHeight: ' + this.boardHeight)
        let imgSize = this.set === 'default' ? '100%' : '80%';
        let xorVal = this.flipped ? 7 : 56;
        return (h("div", { class: "board", id: `${this.id}-board`, ref: (el) => this['boardElement'] = el, onContextMenu: (ev) => {
                console.log(ev);
                ev.preventDefault();
                if (this.boardMode === ChessBoard.boardModes.MODE_SETUP)
                    return;
                // if (confirm("Enter Setup")) {
                //   this.setup()
                // }
                this.menuX = ev.clientX;
                this.menuY = ev.clientY;
                this.menuDisplay = 'block';
            }, style: {
                display: 'flex',
                flexDirection: 'column',
                background: 'transparent',
                width: window['innerHeight'] > window['innerWidth'] ? '100%' : '60%',
                minWidth: window['innerHeight'] > window['innerWidth'] ? '100%' : '60%',
                maxWidth: window['innerHeight'] > window['innerWidth'] ? '100%' : '60%',
                height: `${this.boardHeight}px`,
                minHeight: `${this.boardHeight}px`,
                maxHeight: `${this.boardHeight}px`,
                opacity: this.isPromoting ? '0.3' : '1'
            }, onDblClick: () => this.flip() }, [0, 1, 2, 3, 4, 5, 6, 7].map(y => {
            return (h("div", { key: y, style: {
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '12.5%'
                } }, [0, 1, 2, 3, 4, 5, 6, 7].map(x => {
                let index = (y * 8 + x) ^ xorVal;
                let figure = this.getPos(this.current)[index];
                return (h("div", { class: "square", key: y * 8 + x, onDragEnter: ev => ev.preventDefault(), onDragOver: ev => ev.preventDefault(), onDrop: ev => this.onDrop(index, ev), onClick: ev => this.onSquareClick(index, figure, ev), style: {
                        webkitTapHighlightColor: 'transparent',
                        webkitUserSelect: 'none',
                        mozTapHighlightColor: 'transparent',
                        mozUserSelect: 'none',
                        msTapHighlightColor: 'transparent',
                        msUserSelect: 'none',
                        outlineStyle: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '12.5%',
                        maxWidth: '12.5%',
                        minWidth: '12.5%',
                        height: '100%',
                        minHeight: '100%',
                        maxHeight: '100%',
                        backgroundColor: this.sqFrom === index
                            && this.boardMode != ChessBoard.boardModes.MODE_SETUP
                            ? this.highLightBg
                            : Game.isLight(index)
                                ? this.lightBgColor
                                : this.darkBgColor
                    } }, figure === '0' ?
                    ' ' :
                    h("img", { class: "figure", style: {
                            webkitTapHighlightColor: 'transparent',
                            webkitUserSelect: 'none',
                            mozTapHighlightColor: 'transparent',
                            mozUserSelect: 'none',
                            msTapHighlightColor: 'transparent',
                            msUserSelect: 'none',
                            outlineStyle: 'none',
                            width: imgSize,
                            height: imgSize,
                            cursor: this.canStartHere(figure)
                                ? 'pointer'
                                : 'not-allowed',
                            opacity: this.isDragging && index === this.sqFrom
                                ? '0'
                                : '1'
                        }, src: chessSets[this.set][figure], onDragStart: (ev) => this.onDragStart(figure, index, ev), onDragEnd: () => this.isDragging = false })));
            })));
        })));
    }
    renderPromotionPanel() {
        const promFigures = this.getTurn() === 'b' ? 'qnrb' : 'QNRB';
        const [left, top] = this.isMounted
            ? [this['boardElement']['offsetLeft'], this['boardElement']['offsetTop']]
            : [-1, -1];
        const sqSize = this.boardHeight / 8;
        const offsetLeft = left + (Game.col(this.sqTo) ^ (this.flipped ? 7 : 0)) * sqSize;
        const offsetTop = top + (Game.row(this.sqTo) ^ (this.flipped ? 0 : 7)) * sqSize;
        return (h("div", { style: {
                display: this.isPromoting ? 'flex' : 'none',
                position: 'absolute',
                flexDirection: 'row',
                width: `${this.boardHeight / 2}px`,
                maxWidth: `${this.boardHeight / 2}px`,
                minWidth: `${this.boardHeight / 2}px`,
                height: `${this.boardHeight / 8}px`,
                maxHeight: `${this.boardHeight / 8}px`,
                minHeight: `${this.boardHeight / 8}px`,
                border: `solid 3px ${this.highLightBg}`,
                background: Game.isLight(this.sqTo) ? this.lightBgColor : this.darkBgColor,
                top: `${offsetTop}px`,
                left: `${offsetLeft}px`,
                zIndex: '100',
                opacity: '1'
            } }, promFigures.split('').map((f, _) => {
            return (h("div", { style: {
                    width: `25%`,
                    maxWidth: `25%`,
                    minWidth: `25%`,
                    height: `100%`,
                    minHeight: `100%`,
                    maxHeight: `100%`,
                }, onClick: (_) => {
                    this.handleEndMove(this.sqFrom, this.sqTo, this.figureFrom, f);
                    this.isPromoting = false;
                } },
                h("img", { style: {
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                    }, src: chessSets[this.set][f] })));
        })));
    }
    renderMenuPanel() {
        let arrSchemas = [];
        for (let schema in ChessBoard.schemas)
            arrSchemas = [...arrSchemas, schema];
        let arrFigures = [];
        for (let set in chessSets)
            arrFigures = [...arrFigures, set];
        return (h("context-menu", { ref: (el) => this['menuElement'] = el, items: 6, x: this.menuX, y: this.menuY, header: "Options", menuDisplay: this.menuDisplay, ovlBg: "transparent" },
            h("custom-p", { slot: "0", style: { width: '90%' } },
                h("label", null, "Set Auto Promotion (Queen)"),
                h("input", { type: "checkbox", style: { cursor: 'pointer' }, checked: this.autoPromotion !== null, onChange: (e) => {
                        console.log(e);
                        this.autoPromotion = this.autoPromotion === null
                            ? 'Q'
                            : null;
                    } })),
            h("custom-p", { slot: "3", style: { width: '90%' } },
                h("label", null, "Use figurines"),
                h("input", { type: "checkbox", style: { cursor: 'pointer' }, checked: this.useFigurines, onChange: () => {
                        //console.log(e)
                        this.useFigurines = !this.useFigurines;
                    } })),
            h("div", { slot: "1", style: {
                    cursor: 'pointer',
                    border: 'solid 1px',
                    padding: '5px',
                    borderRadius: '8px',
                    background: this.lightBgColor
                }, onClick: () => {
                    this.menuDisplay = 'none';
                    this.setup();
                } }, "Enter Setup Mode"),
            h("div", { slot: "2", style: {
                    cursor: 'pointer',
                    border: 'solid 1px',
                    padding: '5px',
                    borderRadius: '8px',
                    background: this.lightBgColor
                }, onClick: () => {
                    this.flip();
                } }, this.flipped ? 'Unflip Board' : 'Flip Board'),
            h("custom-p", { slot: "4", style: { width: '90%' } },
                h("label", null, "Color schema"),
                h("select", { onChange: (ev) => this.setSchema(ev.target['value']) }, arrSchemas.map(schema => {
                    return h("option", { value: schema, key: schema, selected: ChessBoard.schemas[schema].light === this.lightBgColor }, `${schema.charAt(0).toUpperCase()}${schema.split('').slice(1).join('')}`);
                }))),
            h("custom-p", { slot: "5", style: { width: '90%' } },
                h("label", null, "Figures set"),
                h("select", { onChange: (ev) => this.set = ev.target['value'] }, arrFigures.map(set => {
                    return h("option", { value: set, key: set, selected: set === this.set }, `${set.charAt(0).toUpperCase()}${set.split('').slice(1).join('')}`);
                })))));
    }
    render() {
        this.getBoardHeight();
        return (h("div", { class: "main", id: `${this.id}-main`, ref: (el) => this[`${this.id}-main`] = el, onContextMenu: (ev) => ev.preventDefault(), onKeyDown: (ev) => {
                console.log("Keyboard event code" + ev.charCode);
            }, style: {
                display: 'flex',
                width: '100%',
                minWidth: '100%',
                maxWidth: '100%',
                color: 'steelblue',
                background: 'transparent',
                border: 'solid 1px',
                flexDirection: window['innerHeight'] > window['innerWidth'] ? 'column' : 'row',
            } },
            this.renderBoard(),
            this.renderLateralPanel(),
            this.renderPromotionPanel(),
            this.renderMenuPanel()));
    }
    static get is() { return "chess-board"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "analyze": {
            "method": true
        },
        "autoPromotion": {
            "type": String,
            "attr": "auto-promotion",
            "mutable": true
        },
        "boardHeight": {
            "state": true
        },
        "boardMode": {
            "state": true,
            "watchCallbacks": ["testMode"]
        },
        "canEndHere": {
            "method": true
        },
        "canStartHere": {
            "method": true
        },
        "castlingPermissions": {
            "state": true
        },
        "current": {
            "state": true
        },
        "darkBgColor": {
            "state": true
        },
        "default": {
            "method": true
        },
        "empty": {
            "method": true
        },
        "figureFrom": {
            "state": true
        },
        "flip": {
            "method": true
        },
        "flipped": {
            "state": true
        },
        "getBoardHeight": {
            "method": true
        },
        "getCastling": {
            "method": true
        },
        "getCurrent": {
            "method": true
        },
        "getEngine": {
            "method": true
        },
        "getEnPassant": {
            "method": true
        },
        "getFenPos": {
            "method": true
        },
        "getFullMoveNumber": {
            "method": true
        },
        "getGame": {
            "method": true
        },
        "getHalfMoveClock": {
            "method": true
        },
        "getInitialFen": {
            "method": true
        },
        "getMaxPos": {
            "method": true
        },
        "getMode": {
            "method": true
        },
        "getPgnMoves": {
            "method": true
        },
        "getPos": {
            "method": true
        },
        "getTurn": {
            "method": true
        },
        "goto": {
            "method": true
        },
        "highLightBg": {
            "type": String,
            "attr": "high-light-bg",
            "mutable": true
        },
        "humanSide": {
            "type": String,
            "attr": "human-side",
            "mutable": true
        },
        "id": {
            "type": String,
            "attr": "id"
        },
        "initialDarkBgColor": {
            "type": String,
            "attr": "initial-dark-bg-color"
        },
        "initialFen": {
            "type": String,
            "attr": "initial-fen",
            "reflectToAttr": true
        },
        "initialFlipped": {
            "type": Boolean,
            "attr": "initial-flipped"
        },
        "initialLightBgColor": {
            "type": String,
            "attr": "initial-light-bg-color"
        },
        "initialMode": {
            "type": String,
            "attr": "initial-mode"
        },
        "isDragging": {
            "state": true
        },
        "isFlipped": {
            "method": true
        },
        "isMounted": {
            "state": true
        },
        "isPromoting": {
            "state": true
        },
        "lightBgColor": {
            "state": true
        },
        "menuDisplay": {
            "state": true
        },
        "menuX": {
            "state": true
        },
        "menuY": {
            "state": true
        },
        "play": {
            "method": true
        },
        "rerender": {
            "method": true
        },
        "resetGame": {
            "method": true
        },
        "set": {
            "type": String,
            "attr": "set",
            "mutable": true,
            "watchCallbacks": ["validateSet"]
        },
        "setBg": {
            "method": true
        },
        "setEngine": {
            "method": true
        },
        "sets": {
            "type": "Any",
            "attr": "sets"
        },
        "setSchema": {
            "method": true
        },
        "setSquare": {
            "method": true
        },
        "setup": {
            "method": true
        },
        "setupObj": {
            "state": true
        },
        "sqFrom": {
            "state": true
        },
        "sqTo": {
            "state": true
        },
        "trashbin": {
            "type": String,
            "attr": "trashbin"
        },
        "tryRemoteMove": {
            "method": true
        },
        "undo": {
            "method": true
        },
        "useFigurines": {
            "type": Boolean,
            "attr": "use-figurines",
            "mutable": true
        },
        "version": {
            "type": String,
            "attr": "version"
        },
        "view": {
            "method": true
        }
    }; }
    static get events() { return [{
            "name": "flipEvent",
            "method": "flipEvent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "moveEvent",
            "method": "moveEvent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "closeMenu",
            "method": "onCloseMenu"
        }, {
            "name": "window:resize",
            "method": "handleResize",
            "passive": true
        }, {
            "name": "document:keydown",
            "method": "keybdHandler"
        }, {
            "name": "window:orientationchange",
            "method": "handleReorientation"
        }, {
            "name": "moveEvent",
            "method": "handleMoveEvent"
        }]; }
    static get style() { return "/**style-placeholder:chess-board:**/"; }
}
ChessBoard.boardModes = {
    MODE_ANALYSIS: 'MODE_ANALYSIS',
    MODE_PLAY: 'MODE_PLAY',
    MODE_SETUP: 'MODE_SETUP',
    MODE_VIEW: 'MODE_VIEW'
};
ChessBoard.schemas = {
    brown: { light: '#f0d9b5', dark: '#b58863' },
    blue: { light: '#add8e6', dark: '#6495ed' },
    acqua: { light: '#dfdfdf', dark: '#56b6e2' },
    green: { light: 'beige', dark: '#769656' }
};
ChessBoard.figurines = {
    p: { codePoint: '0x265f', html: '&#9823;' },
    n: { codePoint: '0x265e', html: '&#9822;' },
    b: { codePoint: '0x265d', html: '&#9821;' },
    r: { codePoint: '0x265c', html: '&#9820;' },
    q: { codePoint: '0x265b', html: '&#9819;' },
    k: { codePoint: '0x265a', html: '&#9818;' },
    P: { codePoint: '0x2659', html: '&#9817;' },
    N: { codePoint: '0x2658', html: '&#9816;' },
    B: { codePoint: '0x2657', html: '&#9815;' },
    R: { codePoint: '0x2656', html: '&#9814;' },
    Q: { codePoint: '0x2655', html: '&#9813;' },
    K: { codePoint: '0x2654', html: '&#9812;' }
};
