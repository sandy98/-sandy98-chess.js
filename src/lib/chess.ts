
import { Game, IMoveInfo, IFenObj } from './game'

export interface IFenMoveInfo {
    moveInfo: IMoveInfo
    fen: string
}

export enum PgnState {
	SCANNING = 0,
	LABEL = 1,
	VALUE = 2,
	TOKEN = 3,
	COMMENT = 4,
	VARIANT = 5
}


export class Chess extends Game {

    static difCol(sq1: number, sq2: number): number {
        return Math.abs(Game.col(sq1) - Game.col(sq2))
    }

    static difRow(sq1: number, sq2: number): number {
        return Math.abs(Game.row(sq1) - Game.row(sq2))
    }

    static isSameCol(sq1: number, sq2: number): boolean {
        return Chess.difCol(sq1, sq2) === 0
    }

    static isSameRow(sq1: number, sq2: number): boolean {
        return Chess.difRow(sq1, sq2) === 0
    }

    static isDiagonal(sq1: number, sq2: number): boolean {
        return Chess.difRow(sq1, sq2) === Chess.difCol(sq1, sq2) 
    }

    static isAntiDiagonal(sq1: number, sq2: number): boolean {
        return Chess.isDiagonal(sq1, sq2) && Math.abs(sq1 - sq2) % 7 == 0 && sq1 !== 63 && sq2 !== 63
    }

    static isAdjacent(sq1: number, sq2: number): boolean {
        return Chess.difCol(sq1, sq2) < 2 && Chess.difRow(sq1, sq2) < 2
    }

    static isKingAttack(sq1: number, sq2: number): boolean {
        return (sq1 !== sq2) && Chess.isAdjacent(sq1, sq2)     
    }

    static isWKingCastling(from: number, to: number): boolean {
        return from === 4 && (to === 6 || to === 2)
    }

    static isBKingCastling(from: number, to: number): boolean {
        return from === 60 && (to === 62 || to === 58)
    }

    static isWPawnAttack(from: number, to: number): boolean {
        return (Chess.row(to) === (Chess.row(from) + 1)) && (Chess.difCol(from, to) === 1)
    }

    static isBPawnAttack(from: number, to: number): boolean {
        return (Chess.row(to) === (Chess.row(from) - 1)) && (Chess.difCol(from, to) === 1)
    }

    static isWPawnMove(from: number, to: number): boolean {
        const rowFrom = Game.row(from)
        if (rowFrom === 1) {
            return ((Chess.row(to) === rowFrom + 1) || (Chess.row(to) === rowFrom + 2)) 
              && Chess.isSameCol(from, to)
        } else {
            return (Chess.row(to) === rowFrom + 1) && Chess.isSameCol(from, to)
        }
    }

    static isBPawnMove(from: number, to: number): boolean {
        const rowFrom = Game.row(from)
        if (rowFrom === 6) {
            return ((Chess.row(to) === rowFrom - 1) || (Chess.row(to) === rowFrom - 2)) 
              && Chess.isSameCol(from, to)
        } else {
            return (Chess.row(to) === rowFrom - 1) && Chess.isSameCol(from, to)
        }
    }

    static isKnightAttack(sq1: number, sq2: number): boolean {
        return (Chess.difRow(sq1, sq2) === 2 && Chess.difCol(sq1, sq2) === 1)
          || (Chess.difRow(sq1, sq2) === 1 && Chess.difCol(sq1, sq2) === 2) 
    }

    static isBishopAttack(sq1: number, sq2: number): boolean {
        return (sq1 !== sq2) && Chess.isDiagonal(sq1, sq2)     
    }

    static isRookAttack(sq1: number, sq2: number): boolean {
        return (sq1 !== sq2) && (Chess.isSameRow(sq1, sq2) || Chess.isSameCol(sq1, sq2))
    }

    static isQueenAttack(sq1: number,sq2: number): boolean {
        return Chess.isRookAttack(sq1, sq2) || Chess.isBishopAttack(sq1, sq2)
    }

    static path(sq1: number, sq2: number): number[] {
        if (!Chess.isQueenAttack(sq1, sq2) && !Chess.isKnightAttack(sq1, sq2)) return []
        if (Chess.isKnightAttack(sq1, sq2)) return [sq1, sq2]
        let result: number[] = []
        let sqOrig: number = sq1 <= sq2 ? sq1 : sq2
        let sqDest: number = sq2 >= sq1 ? sq2 : sq1
        let step: number = Chess.isAntiDiagonal(sqOrig, sqDest) ? 7 :
                           Chess.isDiagonal(sqOrig, sqDest) ? 9 :
                           Chess.isSameCol(sqOrig, sqDest) ? 8 : 1
        for (let n: number = sqOrig; n <= sqDest; n += step) {
            result = [...result, n]
        }
        return result
    }

    static innerPath(sq1: number, sq2: number): number[] {
        const p: number[] = Chess.path(sq1, sq2)
        return p.slice(1, p.length - 1)
    }

    static isClearPath (sq1: number, sq2: number, fen: string): boolean {
      const inner: number[] = Chess.innerPath(sq1, sq2)
      if (inner.length === 0) return true
      const fenObj: IFenObj = Game.fen2obj(fen)
      for (let i:number = 0; i < inner.length; i++) {
            if (fenObj.pos[inner[i]] !== '0') return false 
        } 
        return true
    }
       
    static inScope(from: number, to: number, fen: string, onlyAttacks: boolean = false): boolean {
        const fenObj: IFenObj = Game.fen2obj(fen)
        const figure: string = fenObj.pos[from]

        switch (figure) {
           case 'p':
             if (onlyAttacks) {
               return Chess.isBPawnAttack(from, to)
             } else {
                 return Chess.isBPawnAttack(from, to) || Chess.isBPawnMove(from, to)
             }
           case 'P':
             if (onlyAttacks) {
               return Chess.isWPawnAttack(from, to)
             } else {
                 return Chess.isWPawnAttack(from, to) || Chess.isWPawnMove(from, to)
             }
           case 'n':
           case 'N':
             return Chess.isKnightAttack(from, to) 
           case 'b':
           case 'B':
             return Chess.isBishopAttack(from, to)
           case 'r':
           case 'R':
             return Chess.isRookAttack(from, to) 
           case 'q':
           case 'Q':
             return Chess.isQueenAttack(from, to)
           case 'k':
             if (onlyAttacks) {
               return Chess.isKingAttack(from, to)
             } else {
                 return Chess.isKingAttack(from, to) || Chess.isBKingCastling(from, to)
             }
           case 'K':
             if (onlyAttacks) {
               return Chess.isKingAttack(from, to)
             } else {
                 return Chess.isKingAttack(from, to) || Chess.isWKingCastling(from, to)
             }
           default:
             return false      
        }
    }

    static army(color: string, fen: string): number[] {
        const army_string: string = color === 'b' ? 'pnbrqk' : 'PNBRQK'
        const position: string = Game.fen2obj(fen).pos
        const indexes = position.split('').map((_, i) => i)
        return indexes.filter((i => army_string.includes(position[i])))
    }

    static attacksOnSquare(color: string, fen: string, square: number): number [] {
        const position: string = Game.fen2obj(fen).pos
        const attackers: number[] = Chess.army(color, fen)
        return attackers.filter(i => Chess.canAttack(i, square, fen))
    }

    static canReach(from: number, to: number, fen: string): boolean {
      return Chess.inScope(from, to, fen) && Chess.isClearPath(from, to, fen)
    }

    static canAttack(from: number, to: number, fen: string): boolean {
        return Chess.inScope(from, to, fen, true) && Chess.isClearPath(from, to, fen)
    }

    static kingSquare(color: string, fen: string): number {
        const king = color === 'w' ? 'K' : 'k'
        const fenObj = Game.fen2obj(fen)
        for (let i: number = 0; i < 64; i++) {
            if (fenObj.pos[i] === king) return i
        }
        return -1
    }

    static checks (color: string, fen: string): number {
        let jaques: number = 0
        const attackers: string = color === 'w' ? 'b' : 'w'
        const kingSq: number = Chess.kingSquare(color, fen)
        return Chess.attacksOnSquare(attackers, fen, kingSq).length
    }

    static sideCanWin(side: string, fen: string): boolean {
        if (!"wb".includes(side) || side.length !== 1) return false
        const pos: string[] = Game.fen2obj(fen).pos.split('')
        let [p, n, b, r, q] = side === 'b' ? ['p', 'n', 'b', 'r', 'q'] : ['P', 'N', 'B', 'R', 'Q']
        let [fp, fn, fb, fr, fq] = side === 'w' ? ['p', 'n', 'b', 'r', 'q'] : ['P', 'N', 'B', 'R', 'Q']
        let [pc, nc, bc, rc, qc] = [
          Game.countFigures(p, fen),
          Game.countFigures(n, fen),
          Game.countFigures(b, fen),
          Game.countFigures(r, fen),
          Game.countFigures(q, fen)
        ]
        let [fpc, fnc, fbc, frc, fqc] = [
          Game.countFigures(fp, fen),
          Game.countFigures(fn, fen),
          Game.countFigures(fb, fen),
          Game.countFigures(fr, fen),
          Game.countFigures(fq, fen)
        ]
  
        // console.log(pc, nc, bc, rc, qc, " - ", fpc, fnc, fbc, frc, fqc)
  
        if (pc || rc || qc) return true
  
        if (nc && bc) return true
  
        switch (nc) {
          case 0:
            if (!bc) return false
            break
          case 1:
            if (fpc || fnc || fbc || frc) {
              return true
            } else {
              return false
            }
          case 2:
            if (fpc || fnc || fbc || frc || fqc) {
              return true
            } else {
              return false
            }
          default:
            return true
        }
  
        switch (bc) {
          case 0:
            return false
          case 1:
            if (fpc || fnc) {
              return true
            } else if (fbc) {
                let bcolors: string[] = Game.figuresColors(b, fen)
                let fbcolors: string[] = Game.figuresColors(fb, fen)
                for (let i: number = 0; i < fbcolors.length; i++) {
                    if (bcolors[0] !== fbcolors[i]) return true
                }
                return false
            } else {
              return false
            }
          default:
            let bcolors: string[] = Game.figuresColors(b, fen)
            for (let i: number = 1; i < bcolors.length; i++) {
                if (bcolors[0] !== bcolors[i]) return true
            }
            if (fpc || fnc) {
                return true
              } else if (fbc) {
                  let fbcolors: string[] = Game.figuresColors(fb, fen)
                  for (let i: number = 0; i < fbcolors.length; i++) {
                      if (bcolors[0] !== fbcolors[i]) return true
                  }
                  return false
              } else {
                return false
            }
  
        }
  
        return false
      }  

    static lex_pgnfile(pgnFileStr: string): string[] {
        pgnFileStr = pgnFileStr.replace(/\r/g, '\n')
        let pgnFragments: string[] = pgnFileStr.split(/\n{2,}/)
        if (Game.isOdd(pgnFragments.length)) pgnFragments = pgnFragments.slice(0, pgnFragments.length - 1)
        if (!pgnFragments.length) return [""]
        let pgns: string[] = []
        for (let n: number = 0; n < pgnFragments.length; n += 2) {
            pgns = [...pgns, [pgnFragments[n], pgnFragments[n + 1]].join('\n\n')]
        }
        return pgns
    }
     
    static parse_pgnfile(pgnFileStr: string): Chess[] {
        const pgns: string[] = Chess.lex_pgnfile(pgnFileStr)
        if (!pgns.length) return []
        let games: Chess[] = []
        for (let n: number = 0; n < pgns.length; n++) {
            let game = new Chess()
            if (game.load_pgn(pgns[n])) games = [...games, game]
        }
        return games
    }

    san2MoveInfo(san: string, fen: string = this.fen()): IMoveInfo {
        // overriden
        //const sanRegExp = /(?:(^0-0-0|^O-O-O)|(^0-0|^O-O)|(?:^([a-h])(?:([1-8])|(?:x([a-h][1-8])))(?:=?([NBRQ]))?)|(?:^([NBRQK])([a-h])?([1-8])?(x)?([a-h][1-8])))(?:(\+)|(#)|(\+\+))?$/

        if (!san.length) return <IMoveInfo>null
        const match = san.match(Game.sanRegExp)
        if (!match) return  <IMoveInfo>null
        const [_, longC, shortC, 
               pawnCol, pawnDestRow, pawnCaptureDest, promotion,
               figure, origCol, origRow, captureToken, figureDest, 
               check, ckeckMate, altCheckMate] = match
        const fen_obj = Game.fen2obj(fen)       
        let retInfo = <IMoveInfo>{}
        retInfo.turn = fen_obj.turn
        retInfo.fullMoveNumber = fen_obj.fullMoveNumber
        

        if (longC) {
            retInfo.figureFrom = retInfo.turn === 'b' ? 'k' : 'K'
            retInfo.figureTo = '0'
            retInfo.from = retInfo.turn === 'b' ? 60 : 4
            retInfo.to = retInfo.turn === 'b' ? 58 : 2
            retInfo.san = 'O-O-O'
            retInfo.castling = true
            return retInfo
        } 
        if (shortC) {
            retInfo.figureFrom = retInfo.turn === 'b' ? 'k' : 'K'
            retInfo.figureTo = '0'
            retInfo.from = retInfo.turn === 'b' ? 60 : 4
            retInfo.to = retInfo.turn === 'b' ? 62 : 6
            retInfo.san = 'O-O'
            retInfo.castling = true
            return retInfo
        }

        if (pawnCol) {
         retInfo.figureFrom = retInfo.turn === 'b' ? 'p' : 'P'
         let origCol: number = Game.string2col(pawnCol)
         let origRow: number
         let destCol: number
         let destRow: number  
         if (pawnDestRow) {
            retInfo.figureTo = '0'
            destRow = Game.string2row(pawnDestRow)
            destCol = origCol
            origRow = retInfo.turn === 'b' ? destRow + 1 : destRow - 1
            retInfo.from = Game.rowcol2sq(origRow, origCol)
            if (!fen_obj.pos[retInfo.from].match(/[Pp]/)) {
                retInfo.from += retInfo.turn === 'b' ? 8 : -8
            }
            if (!fen_obj.pos[retInfo.from].match(/[Pp]/)) {
                return <IMoveInfo>null
            }
            retInfo.to = Game.rowcol2sq(destRow, destCol)
         } else if (pawnCaptureDest) {
            retInfo.capture = true
            retInfo.to = Game.san2sq(pawnCaptureDest)
            retInfo.figureTo = fen_obj.pos[retInfo.to]
            origRow = Game.row(retInfo.to) + ((retInfo.turn === 'w') ? -1 : 1)
            retInfo.from = Game.rowcol2sq(origRow, origCol) 
            //console.log(origRow)
            //console.log(retInfo)
         }
         if (promotion) {
             retInfo.promotion = retInfo.turn === 'b' 
               ? promotion.toLowerCase()
               : promotion.toUpperCase()
         }
         return retInfo
        } else if (figure) {
          let figurine: string = retInfo.turn === 'w' ? figure.toUpperCase() : figure.toLowerCase()
          //console.log(`Figurine: ${figurine}`)
          retInfo.figureFrom = figurine
          retInfo.from = -1
          retInfo.to = Game.san2sq(figureDest)
          retInfo.figureTo = fen_obj.pos[retInfo.to]
          retInfo.capture = retInfo.figureTo !== '0'
        //   const candidates: IMoveInfo[] = this.moves({verbose: true})
        //   .filter((mi: IMoveInfo) => {
        //     return mi.figureFrom === figurine && mi.to === retInfo.to 
        //   })
          const candidates: number[] = Game.boardArray().filter(i => fen_obj.pos[i] === figurine)
          .filter(i => Chess.canReach(i, retInfo.to, fen))
          .filter(i => {
              const info: IFenMoveInfo = this.tryMove(i, retInfo.to)
              return info && this.validate_fen(info.fen) 
          })
          //console.log(`Candidates: ${candidates}`)
          switch (candidates.length) {
              case 0:
                return <IMoveInfo>null
              case 1:
                retInfo.from = candidates[0]
                break
              default:
                if (origCol && origRow) {
                    let from: number = Game.san2sq(`${origCol}${origRow}`)
                    for (let n: number = 0; n < candidates.length; n++) {
                        if (candidates[n] === from) {
                            retInfo.from = from
                            break
                        }
                    }
                } else if (origCol) {
                    let col = Game.string2col(origCol)
                    for (let n: number = 0; n < candidates.length; n++) {
                        if (Game.col(candidates[n]) === col) {
                            retInfo.from = candidates[n]
                            break
                        }
                    }
                } else if (origRow) {
                    let row = Game.string2row(origRow)
                    for (let n: number = 0; n < candidates.length; n++) {
                        if (Game.row(candidates[n]) === row) {
                            retInfo.from = candidates[n]
                            break
                        }
                    }
                } else {
                    return <IMoveInfo>null
                }
          }
          return retInfo.from !== -1 ? retInfo : <IMoveInfo>null  
        } else {
            return <IMoveInfo>null
        }

    }
  
    canMove(moveInfo: IMoveInfo, n: number = this.getMaxPos()): boolean {
        //Overriden version

        const parentResult = super.canMove(moveInfo, n)
        if (!parentResult) return false
        //super.canMove() tests: 
        // 1) that the original figure is a valid one
        // 2) that the turn is correct
        // 3) that it's not "friendly fire", i.e. not moving over a friend figure.

        const result = Chess.canReach(moveInfo.from, moveInfo.to, this.fens[n])
        if (!result) return false
        
        //Todo: consider constraints for pawn actions and castling before returning true

        //King castling constraints
        if (moveInfo.figureFrom === 'K' && moveInfo.from === 4 && moveInfo.to === 6) {
            if (!this.getCastling(n).includes('K')) return false
            if (moveInfo.figureTo !== '0') return false
            if (Chess.attacksOnSquare('b', this.fens[n], 4).length) return false 
            if (Chess.attacksOnSquare('b', this.fens[n], 5).length) return false 
        }
        if (moveInfo.figureFrom === 'K' && moveInfo.from === 4 && moveInfo.to === 2) {
            if (!this.getCastling(n).includes('Q')) return false
            if (moveInfo.figureTo !== '0') return false
            if (Chess.attacksOnSquare('b', this.fens[n], 4).length) return false 
            if (Chess.attacksOnSquare('b', this.fens[n], 3).length) return false 
        }
        if (moveInfo.figureFrom === 'k' && moveInfo.from === 60 && moveInfo.to === 62) {
            if (!this.getCastling(n).includes('k')) return false
            if (moveInfo.figureTo !== '0') return false
            if (Chess.attacksOnSquare('w', this.fens[n], 60).length) return false 
            if (Chess.attacksOnSquare('w', this.fens[n], 61).length) return false 
            }
            if (moveInfo.figureFrom === 'k' && moveInfo.from === 60 && moveInfo.to === 58) {
                if (!this.getCastling(n).includes('q')) return false
                if (moveInfo.figureTo !== '0') return false
                if (Chess.attacksOnSquare('w', this.fens[n], 60).length) return false 
                if (Chess.attacksOnSquare('w', this.fens[n], 59).length) return false 
            }

        //Consider pawn move constraints
        const isFoe: boolean = moveInfo.to === Game.san2sq(this.getEnPassant(n)) 
            || Game.isFoe(moveInfo.figureFrom, moveInfo.figureTo)
        if (moveInfo.figureFrom === 'P') {
            if (Chess.isWPawnMove(moveInfo.from, moveInfo.to) && moveInfo.figureTo !== '0') return false
            if (Chess.isWPawnAttack(moveInfo.from, moveInfo.to) && !isFoe) return false
        }
        if (moveInfo.figureFrom === 'p') {
            if (Chess.isBPawnMove(moveInfo.from, moveInfo.to) && moveInfo.figureTo !== '0') return false
            if (Chess.isBPawnAttack(moveInfo.from, moveInfo.to) && !isFoe) return false
        }
            
        return true
    }

    tryMove(from: any, to: any, promotion: string = <string>null): IFenMoveInfo {

        let moveInfo: IMoveInfo
        
        if (typeof from === 'string') {
          from = Game.san2sq(from)
        }  
    
        if (typeof to === 'string') {
          to = Game.san2sq(to)
        }  

        if (Game.outOfBounds(from, to)) return <IFenMoveInfo>null

        let fObj: IFenObj = Game.fen2obj(this.fens[this.getMaxPos()])
        let pos: string[] = fObj.pos.split('')
        let turn: string = fObj.turn
        let figFrom: string = pos[from]
        let figInTo: string = pos[to]
        let figTo: string = promotion ? promotion : figFrom

        moveInfo = <IMoveInfo>{enPassant: false}

        moveInfo.turn = turn
        moveInfo.from = from
        moveInfo.to = to
        moveInfo.figureFrom = figFrom
        moveInfo.figureTo = figInTo
        moveInfo.promotion = promotion
        moveInfo.capture = figInTo !== '0' || (this.isEnPassant(from, to) 
          && to === Game.san2sq(fObj.enPassant))
        //console.log(`moveInfo.figureFrom = ${moveInfo.figureFrom}`)  
        moveInfo.san = this.moveInfo2san(moveInfo)
        moveInfo.fullMoveNumber = fObj.fullMoveNumber
        moveInfo.castling = this.isShortCastling(from, to, moveInfo.figureFrom) || this.isLongCastling(from, to, moveInfo.figureFrom)

        let bCan = this.canMove(moveInfo)

        if (!bCan) return <IFenMoveInfo>null

        pos[from] = '0'
        pos[to] = figTo
        if (figFrom === 'K' && from === 4 && to === 6) {
            pos[7] = '0'
            pos[5] = 'R'
            moveInfo.san = 'O-O'
        }
        if (figFrom === 'K' && from === 4 && to === 2) {
            pos[0] = '0'
            pos[3] = 'R'
            moveInfo.san = 'O-O-O'
        }
        if (figFrom === 'k' && from === 60 && to === 62) {
            pos[63] = '0'
            pos[61] = 'r'
            moveInfo.san = 'O-O'
        }
        if (figFrom === 'k' && from === 60 && to === 58) {
            pos[56] = '0'
            pos[59] = 'R'
            moveInfo.san = 'O-O-O'
        }

        if (this.isEnPassant(from, to)) {
            ////console.log("En passant move from " + from + " to " + to)
            if (to !== Game.san2sq(fObj.enPassant)) {
                ////console.log(`Destination is ${to} and en-passant is ${Game.san2sq(fObj.enPassant)}`)
            } else {
                let sunk: number = Game.san2sq(fObj.enPassant) + 8 * (figFrom === 'P' ? -1 : 1)
                ////console.log("En passant sunk pawn at " + sunk) 
                pos[sunk] = '0'
                moveInfo.enPassant = true
            }
        }

        switch(from) {
            case 4:
            fObj.castling = fObj.castling.replace(/[KQ]/g, '')
            break
            case 60:
            fObj.castling = fObj.castling.replace(/[kq]/g, '')
            break
            case 0:
            fObj.castling = fObj.castling.replace('Q', '')
            break
            case 7:
            fObj.castling = fObj.castling.replace('K', '')
            break
            case 56:
            fObj.castling = fObj.castling.replace('q', '')
            break
            case 63:
            fObj.castling = fObj.castling.replace('k', '')
            break
            default:
        }
        fObj.castling = fObj.castling === '' ? '-' : fObj.castling

        if (this.isTwoSteps(from, to)) {
            fObj.enPassant = Game.sq2san(figFrom === 'P' ? to - 8 : to + 8)
        } else {
            fObj.enPassant = '-'
        }

        fObj.halfMoveClock = !!figFrom.match(/[Pp]/) || moveInfo.capture ? 0 : ++fObj.halfMoveClock
        fObj.fullMoveNumber = turn === 'w' ? fObj.fullMoveNumber : ++ fObj.fullMoveNumber
        
        fObj = {
            ...fObj, 
            pos: pos.join(''), 
            fenPos: Game.compressFenPos(pos.join('')),
            turn: turn === 'w' ? 'b' : 'w'
        }
        return {fen: Game.obj2fen(fObj), moveInfo: moveInfo}
    }

    game_over(): boolean {
    //Overriden
    return this.in_checkmate() 
        || this.in_stalemate()
        || this.in_draw()
        || this.in_threefold_repetition() 
        || this.insufficient_material()
    }


    in_check(index: number = this.getMaxPos()): boolean {
    if (index < 0 || index > this.getMaxPos()) return false
    return Chess.checks(this.getTurn(index), this.fen(index)) > 0
    }

    in_checkmate(index: number = this.getMaxPos()): boolean {
    //Overriden
    if (index < 0 || index > this.getMaxPos()) return false
    return this.in_check(index) && this.moves(null, index).length === 0
    }

    in_draw(index: number = this.getMaxPos()): boolean {
    //Overriden
        return this.insufficient_material(index) || Game.fen2obj(this.fen(index)).halfMoveClock >= 100
    }

    in_stalemate(index: number = this.getMaxPos()): boolean {
    //Overriden
      return !this.in_check(index) && this.moves(null, index).length === 0
    }

    insufficient_material(index: number = this.getMaxPos()): boolean
    {
    //Overriden
      return (!Chess.sideCanWin('w', this.fen(index)) && !Chess.sideCanWin('b', this.fen(index)))
    }


	load_pgn(pgn: string): boolean {
            let current: string = ''
            let token_str: string = ""
            let label_str: string = ""
            let value_str: string = ""
            let index: number = 0
            let state: PgnState = PgnState.SCANNING
            let prev_state: PgnState = PgnState.SCANNING

            let game: Chess = new Chess()
            
            let strip_nums = (text: string): string => text.replace(/\d+\.\s*(\.\.\.)?\s*/g, '')

            let is_san = (text: string): boolean => !!text.match(Game.sanRegExp)

            let is_result = (text: string): boolean => {
                for (let n in Game.results) {
                    if (text === Game.results[n]) return true
                }
                return false
            }

            do {
                current = pgn[index++];
        
                switch (state) {
                    case PgnState.SCANNING:
                    if ('[' === current) {
                        state = PgnState.LABEL
                        continue	
                    } else if ('{' === current) {
                        prev_state = state
                        state = PgnState.COMMENT
                        continue
                    } else if ('(' === current) {
                        prev_state = state
                        state = PgnState.VARIANT
                        continue
                    } else if (current.match(/[\s\]]/)) {
                        continue
                    } else {
                        state = PgnState.TOKEN
                        token_str = current
                        continue
                    }

                    case 1: //PgnState.LABEL:
                    if ('"' === current) {
                        state = PgnState.VALUE
                    } else {
                        label_str += current
                    }
                    continue

                    case 2: //PgnState.VALUE:
                    if ('"' === current) {
                        state = PgnState.SCANNING
                        game.header(label_str.trim(), value_str)
                        label_str = ""
                        value_str = ""
                    } else {
                        value_str += current
                    }
                    continue 
                    case 3: //PgnState.TOKEN:
                        if ('{' == current) {
                            prev_state = state
                            state = PgnState.COMMENT
                        } else if ('(' == current) {
                            prev_state = state
                            state = PgnState.VARIANT
                        } else if (current.match(/[\s\[]/)) {
                            if (is_result(token_str)) game.header("Result", token_str)
                            if (is_result(token_str) || '[' === current) {
                                this.fens = game.fens
                                this.sans = game.sans
                                this.tags = game.tags
                                return true		
                            }
                            let stripped: string = strip_nums(token_str)
                            if (is_san(stripped)) {
                                let bmove = game.move(stripped)
                                if (!bmove) return false
                            }
                            token_str = ""
                        } else {
                            token_str += current
                        }
                    continue
                    case PgnState.COMMENT:
                    if ('}' == current) {
                        state = prev_state
                    }
                    continue
                    case PgnState.VARIANT:
                    if (')' == current) {
                        state = prev_state
                    }
                    continue
                    default:
                    continue
                } 
            } while (index < pgn.length)
            this.fens = game.fens
            this.sans = game.sans
            this.tags = game.tags
            return true 		
    }


    getInfoOrigin(info: IMoveInfo, fen: string = this.fen()): string {
        if (!!info.figureFrom.match(/[Pp]/)) return ''
        const pos: string[] = Game.fen2obj(fen).pos.split('')
        const army: number[] = pos.map((_, i) => i).filter((n) => n != info.from && pos[n] === info.figureFrom)
        if (!army.length) return ''
        const candidates: number[] = army.filter(n => Chess.canReach(n, info.to, fen))
        if (!candidates.length) return ''
        const alternatives: number[] = candidates.filter(n => {
            const tuple: IFenMoveInfo = this.tryMove(n, info.to, info.promotion)
            return !!tuple && this.validate_fen(tuple.fen)
        })
        //console.log(`alternatives[${info.figureFrom}]: ${alternatives}`)
        switch (alternatives.length) {
            case 0:
              return ''
            case 1:
              if (Chess.isSameCol(info.from, alternatives[0])) {
                  return Game.row2string(Game.row(info.from))
              } else {
                  return Game.col2string(Game.col(info.from))
              }
            default:
              return Game.sq2san(info.from)
        }
    }

    move(...args: any[]): boolean {

        let from: any, to: any, promotion: string

        switch (args.length) {
          case 0:
            return false
          case 1: 
            let info: IMoveInfo = this.san2MoveInfo(args[0], this.fen())
            if (!info) return false
            from = info.from
            to = info.to
            promotion = info.promotion
            break
          default:
            from = args[0]
            to = args[1]
            promotion = args[2]                     
        }
        if (typeof from === 'string') from = Game.san2sq(from)
        if (typeof to === 'string') to = Game.san2sq(to)
        if (Game.outOfBounds(from, to)) return false

        //console.log(`from: ${from}, to: ${to}, promotion: ${promotion}`)
        const tuple: IFenMoveInfo = this.tryMove(from, to, promotion)
        if (tuple === null) return false
        if (!this.validate_fen(tuple.fen)) return false
 
        let infoOrigin: string = this.getInfoOrigin(tuple.moveInfo)
        tuple.moveInfo = {...tuple.moveInfo, infoOrigin: infoOrigin}
 
        this.fens = [...this.fens, tuple.fen]
        if (this.in_checkmate()) {
            tuple.moveInfo = {...tuple.moveInfo, checkmate: true}
            this.tags.Result = tuple.moveInfo.turn === 'w' ? Game.results.white : Game.results.black
        } else if (this.in_check()) {
            tuple.moveInfo = {...tuple.moveInfo, check: true}
        } else if (this.in_stalemate()) {
            tuple.moveInfo = {...tuple.moveInfo, stalemate: true}
            this.tags.Result = Game.results.draw
        }
        tuple.moveInfo = {...tuple.moveInfo, san: this.moveInfo2san(tuple.moveInfo)}
        this.sans = [...this.sans, tuple.moveInfo]
        return true
    }

    moves(options: object = null, index: number = this.getMaxPos()): any[] {
        //Overriden
        let result: IMoveInfo[] = []
        const army: string = this.getTurn(index) === 'b' ? 'pnbrqk' : 'PNBRQK'
        const fen: string = this.fens[index]
        const position: string = Game.fen2obj(fen).pos

        for (let from: number = 0; from < 64; from++) {
            if (army.includes(position[from])) {
                for (let to: number = 0; to < 64; to++) {
                    let promotion: string = position[from] === 'P' && Game.row(to) === 7 
                    ? 'Q'
                    : position[from] === 'p' && Game.row(to) === 0
                    ? 'q'
                    : null
                    let tuple: IFenMoveInfo = this.tryMove(from, to, promotion)
                    if (tuple && this.validate_fen(tuple.fen)) {
                        result = [...result, tuple.moveInfo]
                        if (promotion) {
                            let others: string[] = promotion === 'Q' ? ['N', 'R', 'B'] : ['n', 'r', 'b']
                            others.forEach(figure => {
                                result = [...result,
                                          {...tuple.moveInfo, 
                                            promotion: figure, san: tuple.moveInfo.san.replace(promotion, figure)}]
                            })
                        }
                    }
                }
            }
        }

        if (options && options['square']) {
            let from: number = typeof options['square'] === 'string' 
              ? Game.san2sq(options['square']) 
              : options['square']
            result = result.filter(mi => mi.from === from)
        }
        if (options && options['verbose']) {
            return result
        }  else {
            return result.map(mi => mi.san)
        }
    }

    validate_fen(fen: string): boolean {
    //Check length of the string
    if (!fen.length) return false
    
    //Check various anomalies
    const fen_obj: IFenObj = Game.fen2obj(fen)
    const pos: string[] = fen_obj.pos.split('')
    let wKings: number = 0
    let bKings: number = 0
    let wPawns: number = 0
    let bPawns: number = 0
    let illegalFigs: number = 0

    if (pos.length !== 64) return false
    if (!fen_obj.turn.match(/[wb]/)) return false
    if (!fen_obj.castling.match(/([KQkq]+)|(-)/)) return false
    if (!fen_obj.enPassant.match(/([a-h](3|6))|(-)/)) return false

    for (let n = 0; n < 64; n++) {
        switch (pos[n]) {
            case 'K':
            wKings++
            break
            case 'k':
            bKings++
            break
            case 'P':
            wPawns++
            break
            case 'p':
            bPawns++
            break
            default:
            if (!"NBRQnbrq0".includes(pos[n])) illegalFigs++
        }
    }

    if (wPawns > 8 || bPawns > 8 || wKings !== 1 || bKings !== 1 || illegalFigs > 0) return false
    // //console.log(`wPawns: ${wPawns} - bPawns: ${bPawns} - wKings: ${wKings} - bKings: ${bKings}`)

    //Check is not illegal according to checks
    const turn: string = fen_obj.turn
    const wChecks: number = Chess.checks('w', fen)
    const bChecks: number = Chess.checks('b', fen)
    if ((turn === 'w' && bChecks > 0) || (turn === 'b' && wChecks > 0)) return false

    return true
    }    
      
}

if (typeof window !== 'undefined') window['Chess'] = Chess
