// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"game.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var Game = /** @class */function () {
    function Game(fen) {
        if (fen === void 0) {
            fen = Game.defaultFen;
        }
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
    Game.outOfBounds = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var n = 0; n < args.length; n++) {
            if (args[n] < 0 || args[n] > 63) return true;
        }
        return false;
    };
    Game.capitalize = function (word) {
        return "" + word[0].toUpperCase() + word.split('').slice(1).join('').toLowerCase();
    };
    Game.PgnDate = function (dt) {
        if (dt === void 0) {
            dt = new Date();
        }
        var y = dt.getFullYear();
        var m = (dt.getMonth() + 1).toString().replace(/^(\d)$/, '0$1');
        var d = dt.getDate().toString().replace(/^(\d)$/, '0$1');
        return y + "." + m + "." + d;
    };
    Game.row = function (sq) {
        if (typeof sq === 'string') sq = Game.san2sq(sq);
        return Math.floor(sq / 8);
    };
    Game.col = function (sq) {
        if (typeof sq === 'string') sq = Game.san2sq(sq);
        return sq % 8;
    };
    Game.col2string = function (r) {
        return r < 8 && r >= 0 ? String.fromCharCode(r + 97) : '';
    };
    Game.string2col = function (c) {
        return !!c.match(/^[a-h]$/) ? c.charCodeAt(0) - 97 : -1;
    };
    Game.row2string = function (r) {
        return r < 8 && r >= 0 ? (r + 1).toString(10) : '';
    };
    Game.string2row = function (c) {
        return !!c.match(/^[1-8]$/) ? c.charCodeAt(0) - 49 : -1;
    };
    Game.rowcol2sq = function (row, col) {
        if (row < 0 || row > 7 || col < 0 || col > 7) return -1;
        return row * 8 + col;
    };
    Game.isEven = function (sq) {
        if (typeof sq === 'string') sq = Game.san2sq(sq);
        return sq % 2 === 0;
    };
    Game.isOdd = function (sq) {
        if (typeof sq === 'string') sq = Game.san2sq(sq);
        return !Game.isEven(sq);
    };
    Game.isLight = function (sq) {
        if (typeof sq === 'string') sq = Game.san2sq(sq);
        var orec = Game.isOdd(Game.row(sq)) && Game.isEven(Game.col(sq));
        var eroc = Game.isEven(Game.row(sq)) && Game.isOdd(Game.col(sq));
        return orec || eroc;
    };
    Game.isDark = function (sq) {
        return !Game.isLight(sq);
    };
    Game.xor56 = function (pos) {
        var splitted = pos.split('');
        return splitted.map(function (_, i) {
            return splitted[i ^ 56];
        }).join('');
    };
    Game.compressFenPos = function (pos) {
        if (pos === void 0) {
            pos = Game.fen2obj().pos;
        }
        return Game.xor56(pos).match(/\w{8}/g).join('/').replace(/0+/g, function (z) {
            return z.length.toString();
        });
    };
    Game.expandFenPos = function (fenPos) {
        if (fenPos === void 0) {
            fenPos = Game.fen2obj().fenPos;
        }
        return Game.xor56(fenPos.split('/').join('').replace(/\d/g, function (d) {
            return '0'.repeat(parseInt(d));
        }));
    };
    Game.deprecatedCompressFenPos = function (pos) {
        if (pos === void 0) {
            pos = Game.fen2obj().pos;
        }
        var splitted = pos.split('');
        var inverted = splitted.map(function (_, i) {
            return splitted[i ^ 56];
        }).join('');
        return inverted.replace(/(\w{8})(?=\S)/g, "$1/").replace(/(0+)/g, function (zeros) {
            return zeros.length.toString();
        });
    };
    Game.deprecatedExpandFenPos = function (fenPos) {
        if (fenPos === void 0) {
            fenPos = Game.fen2obj().fenPos;
        }
        var expanded = fenPos.replace(/\//g, '').replace(/\d/g, function (i) {
            return '0'.repeat(parseInt(i));
        });
        var splitted = expanded.split('');
        return splitted.map(function (_, i) {
            return splitted[i ^ 56];
        }).join('');
    };
    Game.fen2obj = function (fen) {
        if (fen === void 0) {
            fen = Game.defaultFen;
        }
        var _a = fen.split(/\s+/),
            fenPos = _a[0],
            turn = _a[1],
            castling = _a[2],
            enPassant = _a[3],
            shalfMoveClock = _a[4],
            sfullMoveNumber = _a[5];
        var pos = Game.expandFenPos(fenPos);
        var halfMoveClock = parseInt(shalfMoveClock);
        var fullMoveNumber = parseInt(sfullMoveNumber);
        return { pos: pos, fenPos: fenPos, turn: turn, castling: castling, enPassant: enPassant, halfMoveClock: halfMoveClock, fullMoveNumber: fullMoveNumber };
    };
    Game.obj2fen = function (fenObj) {
        var pos = fenObj.pos,
            fenPos = fenObj.fenPos,
            turn = fenObj.turn,
            castling = fenObj.castling,
            enPassant = fenObj.enPassant,
            halfMoveClock = fenObj.halfMoveClock,
            fullMoveNumber = fenObj.fullMoveNumber;
        if (typeof fenPos === 'undefined') {
            fenPos = Game.compressFenPos(pos);
        }
        return [fenPos, turn, castling, enPassant, halfMoveClock, fullMoveNumber].join(' ');
    };
    Game.isWhiteFigure = function (figure) {
        return 'PNBRQK'.indexOf(figure) !== -1;
    };
    Game.isBlackFigure = function (figure) {
        return 'pnbrqk'.indexOf(figure) !== -1;
    };
    Game.isFriend = function (fig1, fig2) {
        return Game.isWhiteFigure(fig1) && Game.isWhiteFigure(fig2) || Game.isBlackFigure(fig1) && Game.isBlackFigure(fig2);
    };
    Game.isFoe = function (fig1, fig2) {
        return Game.isWhiteFigure(fig1) && Game.isBlackFigure(fig2) || Game.isBlackFigure(fig1) && Game.isWhiteFigure(fig2);
    };
    Game.san2sq = function (san) {
        if (!san.match(/^[a-h][1-8]$/)) return -1;
        return san.charCodeAt(0) - 97 + (san.charCodeAt(1) - 49) * 8;
    };
    Game.sq2san = function (sq) {
        if (sq < 0 || sq > 63) return '-';
        return "" + String.fromCharCode(sq % 8 + 97) + (Math.floor(sq / 8) + 1);
    };
    Game.isEqualPos = function (fen1, fen2) {
        var _a = [Game.fen2obj(fen1), Game.fen2obj(fen2)],
            fen_obj1 = _a[0],
            fen_obj2 = _a[1];
        return fen_obj1.fenPos === fen_obj2.fenPos && fen_obj1.turn === fen_obj2.turn && fen_obj1.castling === fen_obj2.castling && fen_obj1.enPassant === fen_obj2.enPassant;
    };
    Game.boardArray = function () {
        var arr = new Array(64);
        arr.fill(0);
        return arr.map(function (_, i) {
            return i;
        });
    };
    Game.countFigures = function (figure, fen) {
        var pos = Game.fen2obj(fen).pos.split('');
        return pos.filter(function (f) {
            return f === figure;
        }).length;
    };
    Game.figuresArray = function (figure, fen) {
        var pos = Game.fen2obj(fen).pos;
        return Game.boardArray().filter(function (i) {
            return pos[i] === figure;
        });
    };
    Game.figuresColors = function (figure, fen) {
        var figsArr = Game.figuresArray(figure, fen);
        return figsArr.map(function (i) {
            return Game.isLight(i) ? 'light' : 'dark';
        });
    };
    Game.prototype.reset = function (fen) {
        if (fen === void 0) {
            fen = Game.defaultFen;
        }
        if (!this.validate_fen(fen)) {
            throw new Error('Invalid FEN');
        }
        this.fens = [fen];
        this.sans = [{}];
        this.tags.Result = Game.results.unterminated;
    };
    Game.prototype.getMaxPos = function () {
        return this.fens.length - 1;
    };
    Game.prototype._getWhat = function (n, what) {
        if (n === void 0) {
            n = this.getMaxPos();
        }
        if (what === void 0) {
            what = 'pos';
        }
        n = n < 0 ? 0 : n >= this.fens.length ? this.getMaxPos() : n;
        return Game.fen2obj(this.fens[n])[what];
    };
    Game.prototype.getPos = function (n) {
        if (n === void 0) {
            n = this.getMaxPos();
        }
        return this._getWhat(n, 'pos');
    };
    Game.prototype.getFenPos = function (n) {
        if (n === void 0) {
            n = this.getMaxPos();
        }
        return this._getWhat(n, 'fenPos');
    };
    Game.prototype.getTurn = function (n) {
        if (n === void 0) {
            n = this.getMaxPos();
        }
        return this._getWhat(n, 'turn');
    };
    Game.prototype.getCastling = function (n) {
        if (n === void 0) {
            n = this.getMaxPos();
        }
        return this._getWhat(n, 'castling');
    };
    Game.prototype.getEnPassant = function (n) {
        if (n === void 0) {
            n = this.getMaxPos();
        }
        return this._getWhat(n, 'enPassant');
    };
    Game.prototype.getHalfMoveClock = function (n) {
        if (n === void 0) {
            n = this.getMaxPos();
        }
        return parseInt(this._getWhat(n, 'halfMoveClock'));
    };
    Game.prototype.getFullMoveNumber = function (n) {
        if (n === void 0) {
            n = this.getMaxPos();
        }
        return parseInt(this._getWhat(n, 'fullMoveNumber'));
    };
    Game.prototype.isShortCastling = function (from, to, figure) {
        return from === 4 && to === 6 && figure === 'K' || from === 60 && to === 62 && figure === 'k';
    };
    Game.prototype.isLongCastling = function (from, to, figure) {
        return from === 4 && to === 2 && figure === 'K' || from === 60 && to === 58 && figure === 'k';
    };
    Game.prototype.isEnPassant = function (from, to, npos) {
        if (npos === void 0) {
            npos = this.getMaxPos();
        }
        var pos = this.getPos(npos);
        return Game.col(from) !== Game.col(to) && !!pos[from].match(/[Pp]/) && pos[to] === '0';
    };
    Game.prototype.isTwoSteps = function (from, to, npos) {
        if (npos === void 0) {
            npos = this.getMaxPos();
        }
        var pos = this.getPos(npos);
        return Math.abs(Game.row(from) - Game.row(to)) === 2 && !!pos[from].match(/[Pp]/);
    };
    Game.prototype.isPromoting = function (from, to, npos) {
        if (npos === void 0) {
            npos = this.getMaxPos();
        }
        var pos = this.getPos(npos);
        return pos[from] == 'P' && Game.row(to) === 7 || pos[from] == 'p' && Game.row(to) === 0;
    };
    Game.prototype.moveInfo2san = function (info) {
        if (this.isShortCastling(info.from, info.to, info.figureFrom)) return 'O-O';
        if (this.isLongCastling(info.from, info.to, info.figureFrom)) return 'O-O-O';
        //console.log(`In moveInfo2san, figureFrom is: ${info.figureFrom}`)
        var figure = !info.figureFrom.match(/[Pp]/) ? info.figureFrom.toUpperCase() : info.capture ? Game.sq2san(info.from)[0] : '';
        var infoOrigin = info.infoOrigin ? info.infoOrigin : '';
        var capture = info.capture ? 'x' : '';
        var dest = Game.sq2san(info.to);
        var promotion = info.promotion ? "=" + info.promotion.toUpperCase() : '';
        var checkInfo = info.checkmate ? '#' : info.check ? '+' : '';
        return "" + figure + infoOrigin + capture + dest + promotion + checkInfo;
    };
    Game.prototype.san2MoveInfo = function (san, fen) {
        if (fen === void 0) {
            fen = this.fen();
        }
        //Must override
        if (!fen.length) return null;
        if (!san.length) return null;
        return null;
    };
    Game.prototype.canMove = function (moveInfo, n) {
        if (n === void 0) {
            n = this.getMaxPos();
        }
        //Must override
        if (n < 0 || n > this.getMaxPos()) return false;
        var figureFrom = moveInfo.figureFrom,
            figureTo = moveInfo.figureTo,
            turn = moveInfo.turn;
        if ("pnbrqkPNBRQK".indexOf(figureFrom) === -1) return false;
        if (Game.isFriend(figureFrom, figureTo)) return false;
        if (Game.isWhiteFigure(figureFrom) && turn === 'b' || Game.isBlackFigure(figureFrom) && turn === 'w') return false;
        return true;
    };
    Game.prototype.pgnHeaders = function () {
        var arr = [];
        for (var t in this.tags) {
            arr = arr.concat(["[" + t + " \"" + this.tags[t] + "\"]"]);
        }
        return arr.join('\n');
    };
    Game.prototype.pgnMoves = function () {
        var resp = this.history({ verbose: true }).map(function (mi) {
            var info = mi;
            var prefix = info.turn === 'w' ? info.fullMoveNumber + ". " : '';
            var ep = info.enPassant ? ' e.p.' : '';
            return "" + prefix + info.san + ep;
        }).join('  ');
        return resp;
    };
    // Beginning of public interface methods
    Game.prototype.ascii = function (flipBoard, n) {
        if (flipBoard === void 0) {
            flipBoard = false;
        }
        if (n === void 0) {
            n = this.getMaxPos();
        }
        var dottedPos = this.getPos(n).replace(/0/g, '.');
        var header = '   +------------------------+';
        var blank = ' '.repeat(header.length);
        var footer = flipBoard ? '     h  g  f  e  d  c  b  a' : '     a  b  c  d  e  f  g  h';
        var rows = [];
        for (var y = 0; y < 8; y++) {
            var r = flipBoard ? " " + (y + 1) + " |" : " " + (8 - y) + " |";
            for (var x = 0; x < 8; x++) {
                r += " " + dottedPos[y * 8 + x ^ (flipBoard ? 7 : 56)] + " ";
            }
            r += '|';
            rows.push([r, blank].join('\n'));
        }
        return [header, blank].concat(rows, [header, blank, footer]).join('\n');
    };
    Game.prototype.clear = function () {
        this.reset(Game.emptyFen);
    };
    Game.prototype.fen = function (index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        return this.fens[index];
    };
    Game.prototype.history = function (options) {
        if (options === void 0) {
            options = { verbose: false };
        }
        if (options['verbose']) {
            return this.sans.slice(1);
        } else {
            return this.sans.slice(1).map(function (mi) {
                return mi.san;
            });
        }
    };
    Game.prototype.game_over = function () {
        //Must override
        return false;
    };
    Game.prototype.get = function (square, index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        if (typeof square === 'string') square = Game.san2sq(square);
        return this.getPos(index)[square];
    };
    Game.prototype.in_check = function (index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        //Must override
        if (index < 0 || index > this.getMaxPos()) return false;
        return false;
    };
    Game.prototype.in_checkmate = function (index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        //Must override
        if (index < 0 || index > this.getMaxPos()) return false;
        return false;
    };
    Game.prototype.in_draw = function (index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        //Must override
        if (index < 0 || index > this.getMaxPos()) return false;
        return false;
    };
    Game.prototype.in_stalemate = function (index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        //Must override
        if (index < 0 || index > this.getMaxPos()) return false;
        return false;
    };
    Game.prototype.in_threefold_repetition = function (index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        if (index < 0 || index > this.getMaxPos()) return false;
        var sliced = this.fens.map(function (fen) {
            return fen.split(/\s+/).slice(0, 4).join(' ');
        });
        // console.log(sliced)
        for (var i = 0; i <= index; i++) {
            var reps = 1;
            for (var j = i + 1; j <= index; j++) {
                if (sliced[i] === sliced[j]) {
                    reps++;
                    console.log("Position " + sliced[j] + " has repeated " + reps + " times");
                    if (reps >= 3) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Game.prototype.header = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (Game.isOdd(args.length)) args = args.slice(0, args.length - 1);
        if (!args.length) return this.tags;
        var _a = [args.filter(function (_, i) {
            return Game.isEven(i);
        }).map(Game.capitalize), args.filter(function (_, i) {
            return Game.isOdd(i);
        })],
            keys = _a[0],
            values = _a[1];
        for (var n = 0; n < keys.length; n++) {
            this.tags[keys[n]] = values[n];
        }
        return this.tags;
    };
    Game.prototype.insufficient_material = function (_) {
        if (_ === void 0) {
            _ = this.getMaxPos();
        }
        //Must override
        return false;
    };
    Game.prototype.label = function () {
        return this.tags.White + " - " + this.tags.Black + "\t " + this.tags.Result;
    };
    Game.prototype.toString = function () {
        return this.label();
    };
    Game.prototype.load = function (fen) {
        if (fen === void 0) {
            fen = Game.defaultFen;
        }
        this.reset(fen);
        return true;
    };
    Game.prototype.load_pgn = function (pgn) {
        if (!pgn.length) return false;
        //Must override
        return false;
    };
    Game.prototype.move = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var moveInfo;
        var from;
        var to;
        var promotion;
        if (args.length === 0) {
            return false;
        } else if (args.length === 1) {
            if (typeof args[0] === 'string') {
                moveInfo = this.san2MoveInfo(args[0]);
                if (!moveInfo) return false;
                from = moveInfo.from;
                to = moveInfo.to;
                promotion = moveInfo.promotion;
            } else {
                return false;
            }
        } else {
            from = args[0], to = args[1], promotion = args[2];
            if (typeof from === 'string') {
                from = Game.san2sq(from);
            }
            if (typeof to === 'string') {
                to = Game.san2sq(to);
            }
        }
        var fObj = Game.fen2obj(this.fens[this.getMaxPos()]);
        var pos = fObj.pos.split('');
        var turn = fObj.turn;
        var figFrom = pos[from];
        var figInTo = pos[to];
        var figTo = promotion ? promotion : figFrom;
        moveInfo = { enPassant: false };
        moveInfo.turn = turn;
        moveInfo.from = from;
        moveInfo.to = to;
        moveInfo.figureFrom = figFrom;
        moveInfo.figureTo = figInTo;
        moveInfo.promotion = promotion;
        moveInfo.capture = figInTo !== '0' || this.isEnPassant(from, to) && to === Game.san2sq(fObj.enPassant);
        moveInfo.san = this.moveInfo2san(moveInfo);
        moveInfo.fullMoveNumber = fObj.fullMoveNumber;
        moveInfo.castling = this.isShortCastling(from, to, moveInfo.figureFrom) || this.isLongCastling(from, to, moveInfo.figureFrom);
        var bCan = this.canMove(moveInfo);
        if (!bCan) return false;
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
            } else {
                var sunk = Game.san2sq(fObj.enPassant) + 8 * (figFrom === 'P' ? -1 : 1);
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
        } else {
            fObj.enPassant = '-';
        }
        fObj.halfMoveClock = !!figFrom.match(/[Pp]/) || moveInfo.capture ? 0 : ++fObj.halfMoveClock;
        fObj.fullMoveNumber = turn === 'w' ? fObj.fullMoveNumber : ++fObj.fullMoveNumber;
        fObj = __assign({}, fObj, { pos: pos.join(''), fenPos: Game.compressFenPos(pos.join('')), turn: turn === 'w' ? 'b' : 'w' });
        this.fens = this.fens.concat([Game.obj2fen(fObj)]);
        this.sans = this.sans.concat([moveInfo]);
        return true;
    };
    Game.prototype.moves = function (options) {
        if (options === void 0) {
            options = null;
        }
        //Must override
        if (!!options) {
            return [];
        } else {
            return [];
        }
    };
    Game.prototype.pgn = function () {
        return [this.pgnHeaders(), this.pgnMoves()].join('\n\n') + " " + this.tags.Result;
    };
    Game.prototype.put = function (figure, square, index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        if ("pnbrqk0".indexOf(figure.toLowerCase()) === -1) return false;
        if (typeof square === 'string') square = Game.san2sq(square);
        if (square < 0 || square > 63) return false;
        var fen_obj = Game.fen2obj(this.fens[index]);
        var posArray = fen_obj.pos.split('');
        posArray[square] = figure;
        delete fen_obj.fenPos;
        fen_obj.pos = posArray.join('');
        var fen = Game.obj2fen(fen_obj);
        this.fens[index] = fen;
        return true;
    };
    Game.prototype.remove = function (square, index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        return this.put('0', square, index);
    };
    Game.prototype.square_color = function (square) {
        if (typeof square === 'string') square = Game.san2sq(square);
        return Game.isDark(square) ? 'dark' : 'light';
    };
    Game.prototype.turn = function (index) {
        if (index === void 0) {
            index = this.getMaxPos();
        }
        return this.getTurn(index);
    };
    Game.prototype.undo = function () {
        if (this.getMaxPos() < 1) return false;
        this.fens.pop();
        this.sans.pop();
        this.tags.Result = Game.results.unterminated;
        return true;
    };
    Game.prototype.validate_fen = function (fen) {
        //Must override
        if (fen.length) return true;
        return false;
    };
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
    return Game;
}();
exports.Game = Game;
},{}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '44507' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","game.ts"], null)
//# sourceMappingURL=/game.map