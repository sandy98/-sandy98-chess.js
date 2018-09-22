export class Game {
    constructor(fen = Game.defaultFen) {
        ////////////////////////////////////////////////////////////
        this.fens = [];
        this.sans = [];
        this.tags = {
            Event: 'Internet Game',
            Site: 'Internet',
            Date: Game.PgnDate(),
            Round: '?',
            White: 'White Player',
            Black: 'Black Player',
            Result: Game.results.unterminated
        };
        this.reset(fen);
    }
    static outOfBounds(...args) {
        for (let n = 0; n < args.length; n++) {
            if (args[n] < 0 || args[n] > 63)
                return true;
        }
        return false;
    }
    static capitalize(word) {
        return `${word[0].toUpperCase()}${word.split('').slice(1).join('').toLowerCase()}`;
    }
    static PgnDate(dt = new Date()) {
        let y = dt.getFullYear();
        let m = (dt.getMonth() + 1).toString().replace(/^(\d)$/, '0$1');
        let d = (dt.getDate()).toString().replace(/^(\d)$/, '0$1');
        return `${y}.${m}.${d}`;
    }
    static row(sq) {
        if (typeof sq === 'string')
            sq = Game.san2sq(sq);
        return Math.floor(sq / 8);
    }
    static col(sq) {
        if (typeof sq === 'string')
            sq = Game.san2sq(sq);
        return sq % 8;
    }
    static col2string(r) {
        return r < 8 && r >= 0 ? String.fromCharCode(r + 97) : '';
    }
    static string2col(c) {
        return !!c.match(/^[a-h]$/) ? c.charCodeAt(0) - 97 : -1;
    }
    static row2string(r) {
        return r < 8 && r >= 0 ? (r + 1).toString(10) : '';
    }
    static string2row(c) {
        return !!c.match(/^[1-8]$/) ? c.charCodeAt(0) - 49 : -1;
    }
    static rowcol2sq(row, col) {
        if (row < 0 || row > 7 || col < 0 || col > 7)
            return -1;
        return row * 8 + col;
    }
    static isEven(sq) {
        if (typeof sq === 'string')
            sq = Game.san2sq(sq);
        return sq % 2 === 0;
    }
    static isOdd(sq) {
        if (typeof sq === 'string')
            sq = Game.san2sq(sq);
        return !Game.isEven(sq);
    }
    static isLight(sq) {
        if (typeof sq === 'string')
            sq = Game.san2sq(sq);
        const orec = Game.isOdd(Game.row(sq)) && Game.isEven(Game.col(sq));
        const eroc = Game.isEven(Game.row(sq)) && Game.isOdd(Game.col(sq));
        return orec || eroc;
    }
    static isDark(sq) {
        return !Game.isLight(sq);
    }
    static xor56(pos) {
        let splitted = pos.split('');
        return splitted.map((_, i) => splitted[i ^ 56]).join('');
    }
    static compressFenPos(pos = Game.fen2obj().pos) {
        return Game.xor56(pos).match(/\w{8}/g).join('/').replace(/0+/g, z => z.length.toString());
    }
    static expandFenPos(fenPos = Game.fen2obj().fenPos) {
        return Game.xor56(fenPos.split('/').join('').replace(/\d/g, d => '0'.repeat(parseInt(d))));
    }
    static deprecatedCompressFenPos(pos = Game.fen2obj().pos) {
        let splitted = pos.split('');
        let inverted = splitted.map((_, i) => splitted[i ^ 56]).join('');
        return inverted.replace(/(\w{8})(?=\S)/g, "$1/")
            .replace(/(0+)/g, zeros => zeros.length.toString());
    }
    static deprecatedExpandFenPos(fenPos = Game.fen2obj().fenPos) {
        let expanded = fenPos.replace(/\//g, '')
            .replace(/\d/g, (i) => '0'.repeat(parseInt(i)));
        let splitted = expanded.split('');
        return splitted.map((_, i) => splitted[i ^ 56]).join('');
    }
    static fen2obj(fen = Game.defaultFen) {
        let [fenPos, turn, castling, enPassant, shalfMoveClock, sfullMoveNumber] = fen.split(/\s+/);
        let pos = Game.expandFenPos(fenPos);
        let halfMoveClock = parseInt(shalfMoveClock);
        let fullMoveNumber = parseInt(sfullMoveNumber);
        return { pos, fenPos, turn, castling, enPassant, halfMoveClock, fullMoveNumber };
    }
    static obj2fen(fenObj) {
        let { pos, fenPos, turn, castling, enPassant, halfMoveClock, fullMoveNumber } = fenObj;
        if (typeof fenPos === 'undefined') {
            fenPos = Game.compressFenPos(pos);
        }
        return [fenPos, turn, castling, enPassant, halfMoveClock, fullMoveNumber].join(' ');
    }
    static isWhiteFigure(figure) {
        return 'PNBRQK'.indexOf(figure) !== -1;
    }
    static isBlackFigure(figure) {
        return 'pnbrqk'.indexOf(figure) !== -1;
    }
    static isFriend(fig1, fig2) {
        return (Game.isWhiteFigure(fig1) && Game.isWhiteFigure(fig2))
            || (Game.isBlackFigure(fig1) && Game.isBlackFigure(fig2));
    }
    static isFoe(fig1, fig2) {
        return (Game.isWhiteFigure(fig1) && Game.isBlackFigure(fig2))
            || (Game.isBlackFigure(fig1) && Game.isWhiteFigure(fig2));
    }
    static san2sq(san) {
        if (!san.match(/^[a-h][1-8]$/))
            return -1;
        return san.charCodeAt(0) - 97 + (san.charCodeAt(1) - 49) * 8;
    }
    static sq2san(sq) {
        if (sq < 0 || sq > 63)
            return '-';
        return `${String.fromCharCode((sq % 8) + 97)}${Math.floor(sq / 8) + 1}`;
    }
    static isEqualPos(fen1, fen2) {
        let [fen_obj1, fen_obj2] = [Game.fen2obj(fen1), Game.fen2obj(fen2)];
        return fen_obj1.fenPos === fen_obj2.fenPos
            && fen_obj1.turn === fen_obj2.turn
            && fen_obj1.castling === fen_obj2.castling
            && fen_obj1.enPassant === fen_obj2.enPassant;
    }
    static boardArray() {
        const arr = new Array(64);
        arr.fill(0);
        return arr.map((_, i) => i);
    }
    static countFigures(figure, fen) {
        const pos = Game.fen2obj(fen).pos.split('');
        return pos.filter(f => f === figure).length;
    }
    static figuresArray(figure, fen) {
        const pos = Game.fen2obj(fen).pos;
        return Game.boardArray().filter(i => pos[i] === figure);
    }
    static figuresColors(figure, fen) {
        let figsArr = Game.figuresArray(figure, fen);
        return figsArr.map(i => Game.isLight(i) ? 'light' : 'dark');
    }
    reset(fen = Game.defaultFen) {
        if (!this.validate_fen(fen)) {
            throw new Error('Invalid FEN');
        }
        this.fens = [fen];
        this.sans = [{}];
        this.tags.Result = Game.results.unterminated;
    }
    getMaxPos() { return this.fens.length - 1; }
    _getWhat(n = this.getMaxPos(), what = 'pos') {
        n = n < 0 ? 0 : n >= this.fens.length ? this.getMaxPos() : n;
        return Game.fen2obj(this.fens[n])[what];
    }
    getPos(n = this.getMaxPos()) {
        return this._getWhat(n, 'pos');
    }
    getFenPos(n = this.getMaxPos()) {
        return this._getWhat(n, 'fenPos');
    }
    getTurn(n = this.getMaxPos()) {
        return this._getWhat(n, 'turn');
    }
    getCastling(n = this.getMaxPos()) {
        return this._getWhat(n, 'castling');
    }
    getEnPassant(n = this.getMaxPos()) {
        return this._getWhat(n, 'enPassant');
    }
    getHalfMoveClock(n = this.getMaxPos()) {
        return parseInt(this._getWhat(n, 'halfMoveClock'));
    }
    getFullMoveNumber(n = this.getMaxPos()) {
        return parseInt(this._getWhat(n, 'fullMoveNumber'));
    }
    isShortCastling(from, to, figure) {
        return (from === 4 && to === 6 && figure === 'K')
            || (from === 60 && to === 62 && figure === 'k');
    }
    isLongCastling(from, to, figure) {
        return (from === 4 && to === 2 && figure === 'K')
            || (from === 60 && to === 58 && figure === 'k');
    }
    isEnPassant(from, to, npos = this.getMaxPos()) {
        let pos = this.getPos(npos);
        return Game.col(from) !== Game.col(to)
            && !!pos[from].match(/[Pp]/)
            && pos[to] === '0';
    }
    isTwoSteps(from, to, npos = this.getMaxPos()) {
        let pos = this.getPos(npos);
        return Math.abs(Game.row(from) - Game.row(to)) === 2
            && !!pos[from].match(/[Pp]/);
    }
    isPromoting(from, to, npos = this.getMaxPos()) {
        let pos = this.getPos(npos);
        return (pos[from] == 'P' && Game.row(to) === 7)
            || (pos[from] == 'p' && Game.row(to) === 0);
    }
    moveInfo2san(info) {
        if (this.isShortCastling(info.from, info.to, info.figureFrom))
            return 'O-O';
        if (this.isLongCastling(info.from, info.to, info.figureFrom))
            return 'O-O-O';
        //console.log(`In moveInfo2san, figureFrom is: ${info.figureFrom}`)
        let figure = !info.figureFrom.match(/[Pp]/)
            ? info.figureFrom.toUpperCase()
            : info.capture
                ? Game.sq2san(info.from)[0]
                : '';
        let infoOrigin = info.infoOrigin ? info.infoOrigin : '';
        let capture = info.capture ? 'x' : '';
        let dest = Game.sq2san(info.to);
        let promotion = info.promotion ? `=${info.promotion.toUpperCase()}` : '';
        let checkInfo = info.checkmate
            ? '#'
            : info.check
                ? '+'
                : '';
        return `${figure}${infoOrigin}${capture}${dest}${promotion}${checkInfo}`;
    }
    san2MoveInfo(san, fen = this.fen()) {
        //Must override
        if (!fen.length)
            return null;
        if (!san.length)
            return null;
        return null;
    }
    canMove(moveInfo, n = this.getMaxPos()) {
        //Must override
        if (n < 0 || n > this.getMaxPos())
            return false;
        let { figureFrom, figureTo, turn } = moveInfo;
        if ("pnbrqkPNBRQK".indexOf(figureFrom) === -1)
            return false;
        if (Game.isFriend(figureFrom, figureTo))
            return false;
        if ((Game.isWhiteFigure(figureFrom) && turn === 'b')
            || (Game.isBlackFigure(figureFrom) && turn === 'w'))
            return false;
        return true;
    }
    pgnHeaders() {
        let arr = [];
        for (let t in this.tags) {
            arr = [...arr, `[${t} "${this.tags[t]}"]`];
        }
        return arr.join('\n');
    }
    pgnMoves() {
        let resp = this.history({ verbose: true }).map(mi => {
            let info = mi;
            let prefix = info.turn === 'w' ? `${info.fullMoveNumber}. ` : '';
            let ep = info.enPassant ? ' e.p.' : '';
            return `${prefix}${info.san}${ep}`;
        })
            .join('  ');
        return resp;
    }
    // Beginning of public interface methods
    ascii(flipBoard = false, n = this.getMaxPos()) {
        let dottedPos = this.getPos(n).replace(/0/g, '.');
        let header = '   +------------------------+';
        let blank = ' '.repeat(header.length);
        let footer = flipBoard ? '     h  g  f  e  d  c  b  a' : '     a  b  c  d  e  f  g  h';
        let rows = [];
        for (let y = 0; y < 8; y++) {
            let r = flipBoard ? ` ${y + 1} |` : ` ${8 - y} |`;
            for (let x = 0; x < 8; x++) {
                r += ` ${dottedPos[(y * 8 + x) ^ (flipBoard ? 7 : 56)]} `;
            }
            r += '|';
            rows.push([r, blank].join('\n'));
        }
        return [header, blank, ...rows, header, blank, footer].join('\n');
    }
    clear() {
        this.reset(Game.emptyFen);
    }
    fen(index = this.getMaxPos()) { return this.fens[index]; }
    history(options = { verbose: false }) {
        if (options['verbose']) {
            return this.sans.slice(1);
        }
        else {
            return this.sans.slice(1).map(mi => mi.san);
        }
    }
    game_over() {
        //Must override
        return false;
    }
    get(square, index = this.getMaxPos()) {
        if (typeof square === 'string')
            square = Game.san2sq(square);
        return this.getPos(index)[square];
    }
    in_check(index = this.getMaxPos()) {
        //Must override
        if (index < 0 || index > this.getMaxPos())
            return false;
        return false;
    }
    in_checkmate(index = this.getMaxPos()) {
        //Must override
        if (index < 0 || index > this.getMaxPos())
            return false;
        return false;
    }
    in_draw(index = this.getMaxPos()) {
        //Must override
        if (index < 0 || index > this.getMaxPos())
            return false;
        return false;
    }
    in_stalemate(index = this.getMaxPos()) {
        //Must override
        if (index < 0 || index > this.getMaxPos())
            return false;
        return false;
    }
    in_threefold_repetition(index = this.getMaxPos()) {
        if (index < 0 || index > this.getMaxPos())
            return false;
        let sliced = this.fens.map(fen => fen.split(/\s+/).slice(0, 4).join(' '));
        // console.log(sliced)
        for (let i = 0; i <= index; i++) {
            let reps = 1;
            for (let j = i + 1; j <= index; j++) {
                if (sliced[i] === sliced[j]) {
                    reps++;
                    console.log(`Position ${sliced[j]} has repeated ${reps} times`);
                    if (reps >= 3) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    header(...args) {
        if (Game.isOdd(args.length))
            args = args.slice(0, args.length - 1);
        if (!args.length)
            return this.tags;
        let [keys, values] = [args.filter((_, i) => Game.isEven(i)).map(Game.capitalize),
            args.filter((_, i) => Game.isOdd(i))];
        for (let n = 0; n < keys.length; n++) {
            this.tags[keys[n]] = values[n];
        }
        return this.tags;
    }
    insufficient_material(_ = this.getMaxPos()) {
        //Must override
        return false;
    }
    label() { return `${this.tags.White} - ${this.tags.Black}\t ${this.tags.Result}`; }
    toString() { return this.label(); }
    load(fen = Game.defaultFen) {
        this.reset(fen);
        return true;
    }
    load_pgn(pgn) {
        if (!pgn.length)
            return false;
        //Must override
        return false;
    }
    move(...args) {
        let moveInfo;
        let from;
        let to;
        let promotion;
        if (args.length === 0) {
            return false;
        }
        else if (args.length === 1) {
            if (typeof args[0] === 'string') {
                moveInfo = this.san2MoveInfo(args[0]);
                if (!moveInfo)
                    return false;
                from = moveInfo.from;
                to = moveInfo.to;
                promotion = moveInfo.promotion;
            }
            else {
                return false;
            }
        }
        else {
            [from, to, promotion] = args;
            if (typeof from === 'string') {
                from = Game.san2sq(from);
            }
            if (typeof to === 'string') {
                to = Game.san2sq(to);
            }
        }
        let fObj = Game.fen2obj(this.fens[this.getMaxPos()]);
        let pos = fObj.pos.split('');
        let turn = fObj.turn;
        let figFrom = pos[from];
        let figInTo = pos[to];
        let figTo = promotion ? promotion : figFrom;
        moveInfo = { enPassant: false };
        moveInfo.turn = turn;
        moveInfo.from = from;
        moveInfo.to = to;
        moveInfo.figureFrom = figFrom;
        moveInfo.figureTo = figInTo;
        moveInfo.promotion = promotion;
        moveInfo.capture = figInTo !== '0' || (this.isEnPassant(from, to)
            && to === Game.san2sq(fObj.enPassant));
        moveInfo.san = this.moveInfo2san(moveInfo);
        moveInfo.fullMoveNumber = fObj.fullMoveNumber;
        moveInfo.castling = this.isShortCastling(from, to, moveInfo.figureFrom)
            || this.isLongCastling(from, to, moveInfo.figureFrom);
        let bCan = this.canMove(moveInfo);
        if (!bCan)
            return false;
        pos[from] = '0';
        pos[to] = figTo;
        if (figFrom === 'K' && from === 4 && to === 6) {
            pos[7] = '0';
            pos[5] = 'R';
        }
        if (figFrom === 'K' && from === 4 && to === 2) {
            pos[0] = '0';
            pos[3] = 'R';
        }
        if (figFrom === 'k' && from === 60 && to === 62) {
            pos[63] = '0';
            pos[61] = 'r';
        }
        if (figFrom === 'k' && from === 60 && to === 58) {
            pos[56] = '0';
            pos[59] = 'R';
        }
        if (this.isEnPassant(from, to)) {
            //console.log("En passant move from " + from + " to " + to)
            if (to !== Game.san2sq(fObj.enPassant)) {
                //console.log(`Destination is ${to} and en-passant is ${Game.san2sq(fObj.enPassant)}`)
            }
            else {
                let sunk = Game.san2sq(fObj.enPassant) + 8 * (figFrom === 'P' ? -1 : 1);
                //console.log("En passant sunk pawn at " + sunk) 
                pos[sunk] = '0';
                moveInfo.enPassant = true;
            }
        }
        switch (from) {
            case 4:
                fObj.castling = fObj.castling.replace(/[KQ]/g, '');
                break;
            case 60:
                fObj.castling = fObj.castling.replace(/[kq]/g, '');
                break;
            case 0:
                fObj.castling = fObj.castling.replace('Q', '');
                break;
            case 7:
                fObj.castling = fObj.castling.replace('K', '');
                break;
            case 56:
                fObj.castling = fObj.castling.replace('q', '');
                break;
            case 63:
                fObj.castling = fObj.castling.replace('k', '');
                break;
            default:
        }
        fObj.castling = fObj.castling === '' ? '-' : fObj.castling;
        if (this.isTwoSteps(from, to)) {
            fObj.enPassant = Game.sq2san(figFrom === 'P' ? to - 8 : to + 8);
        }
        else {
            fObj.enPassant = '-';
        }
        fObj.halfMoveClock = !!figFrom.match(/[Pp]/) || moveInfo.capture ? 0 : ++fObj.halfMoveClock;
        fObj.fullMoveNumber = turn === 'w' ? fObj.fullMoveNumber : ++fObj.fullMoveNumber;
        fObj = Object.assign({}, fObj, { pos: pos.join(''), fenPos: Game.compressFenPos(pos.join('')), turn: turn === 'w' ? 'b' : 'w' });
        this.fens = [...this.fens, Game.obj2fen(fObj)];
        this.sans = [...this.sans, moveInfo];
        return true;
    }
    moves(options = null) {
        //Must override
        if (!!options) {
            return [];
        }
        else {
            return [];
        }
    }
    pgn() {
        return `${[this.pgnHeaders(), this.pgnMoves()].join('\n\n')} ${this.tags.Result}`;
    }
    put(figure, square, index = this.getMaxPos()) {
        if ("pnbrqk0".indexOf(figure.toLowerCase()) === -1)
            return false;
        if (typeof square === 'string')
            square = Game.san2sq(square);
        if (square < 0 || square > 63)
            return false;
        let fen_obj = Game.fen2obj(this.fens[index]);
        let posArray = fen_obj.pos.split('');
        posArray[square] = figure;
        delete (fen_obj.fenPos);
        fen_obj.pos = posArray.join('');
        let fen = Game.obj2fen(fen_obj);
        this.fens[index] = fen;
        return true;
    }
    remove(square, index = this.getMaxPos()) {
        return this.put('0', square, index);
    }
    square_color(square) {
        if (typeof square === 'string')
            square = Game.san2sq(square);
        return Game.isDark(square) ? 'dark' : 'light';
    }
    turn(index = this.getMaxPos()) {
        return this.getTurn(index);
    }
    undo() {
        if (this.getMaxPos() < 1)
            return false;
        this.fens.pop();
        this.sans.pop();
        this.tags.Result = Game.results.unterminated;
        return true;
    }
    validate_fen(fen) {
        //Must override
        if (fen.length)
            return true;
        return false;
    }
}
Game.results = {
    white: '1-0',
    black: '0-1',
    draw: '1/2-1/2',
    unterminated: '*'
};
Game.defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
Game.emptyFen = '8/8/8/8/8/8/8/8 w - - 0 1';
Game.sicilianFen = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
Game.indiareyFen = 'r1bq1rk1/pppnn1bp/3p4/3Pp1p1/P1P1Pp2/2N2P2/1P2BBPP/R2QNRK1 b - a3 0 13';
Game.yugoslavFen = 'r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9';
Game.berlinFen = 'r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w - - 0 9';
Game.sanRegExp = /(?:(^0-0-0|^O-O-O)|(^0-0|^O-O)|(?:^([a-h])(?:([1-8])|(?:x([a-h][1-8])))(?:=?([NBRQ]))?)|(?:^([NBRQK])([a-h])?([1-8])?(x)?([a-h][1-8])))(?:(\+)|(#)|(\+\+))?$/;
