
import { Game, IMoveInfo as IMoveInfoBase, IFenObj } from './game'

export interface IMoveInfo extends IMoveInfoBase {
    isCheck: boolean
    isCheckMate: boolean
    isStaleMate: boolean
}

export interface IFenMoveInfo {
    moveInfo: IMoveInfo
    fen: string
}

class Chess extends Game {

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

    san2MoveInfo(san: string): IMoveInfo {
        //Must override
        if (!san.length) return <IMoveInfo>null
        return <IMoveInfo>null
      }
  
    canMove(moveInfo: IMoveInfo, n: number = this.getMaxPos()): boolean {
        //Overriden version

        const parentResult = super.canMove(<IMoveInfoBase>moveInfo, n)
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

    tryMove(...args: any[]): IFenMoveInfo {

        let moveInfo: IMoveInfo
        let from: any
        let to: any
        let promotion: string

        if (args.length === 0) {
          return <IFenMoveInfo>null
        } else if (args.length === 1) {
          if (typeof args[0] === 'string') {
            moveInfo = this.san2MoveInfo(args[0])
            if (!moveInfo) return <IFenMoveInfo>null 
            from = moveInfo.from
            to = moveInfo.to
            promotion = moveInfo.promotion
          } else {
            return <IFenMoveInfo>null
          }
        } else {
            [from, to, promotion] = args
            if (typeof from === 'string') {
              from = Game.san2sq(from)
            }  
    
            if (typeof to === 'string') {
              to = Game.san2sq(to)
          }  
        }

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
        moveInfo.san = this.moveInfo2san(moveInfo)
        moveInfo.fullMoveNumber = fObj.fullMoveNumber
        moveInfo.castling = this.isShortCastling(from, to) || this.isLongCastling(from, to)

        let bCan = this.canMove(moveInfo)

        if (!bCan) return <IFenMoveInfo>null

        pos[from] = '0'
        pos[to] = figTo
        if (figFrom === 'K' && from === 4 && to === 6) {
            pos[7] = '0'
            pos[5] = 'R'
        }
        if (figFrom === 'K' && from === 4 && to === 2) {
            pos[0] = '0'
            pos[3] = 'R'
        }
        if (figFrom === 'k' && from === 60 && to === 62) {
            pos[63] = '0'
            pos[61] = 'r'
        }
        if (figFrom === 'k' && from === 60 && to === 58) {
            pos[56] = '0'
            pos[59] = 'R'
        }

        if (this.isEnPassant(from, to)) {
            //console.log("En passant move from " + from + " to " + to)
            if (to !== Game.san2sq(fObj.enPassant)) {
                //console.log(`Destination is ${to} and en-passant is ${Game.san2sq(fObj.enPassant)}`)
            } else {
                let sunk: number = Game.san2sq(fObj.enPassant) + 8 * (figFrom === 'P' ? -1 : 1)
                //console.log("En passant sunk pawn at " + sunk) 
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
    //Must override
    return false
    }


    in_check(index: number = this.getMaxPos()): boolean {
    if (index < 0 || index > this.getMaxPos()) return false
    return Chess.checks(this.getTurn(index), this.fen(index)) > 0
    }

    in_checkmate(index: number = this.getMaxPos()): boolean {
    //Must override
    if (index < 0 || index > this.getMaxPos()) return false
    return this.in_check(index) && this.moves(null, index).length === 0
    }

    in_draw(index: number = this.getMaxPos()): boolean {
    //Must override
    if (index < 0 || index > this.getMaxPos()) return false
    return false
    }

    in_stalemate(index: number = this.getMaxPos()): boolean {
    //Must override
    if (index < 0 || index > this.getMaxPos()) return false
    return !this.in_check(index) && this.moves(null, index).length === 0
    }

    insufficient_material(_: number = this.getMaxPos()): boolean
    {
    //Must override
    return false
    }


    load_pgn(pgn: string): boolean {
    if (!pgn.length) return false
    //Must override
    return false
    }

    move(...args: any[]): boolean {
        const tuple: IFenMoveInfo = this.tryMove(...args)
        if (tuple === null) return false
        if (!this.validate_fen(tuple.fen)) return false
        this.fens = [...this.fens, tuple.fen]
        this.sans = [...this.sans, tuple.moveInfo]
        return true
    }

    moves(options: object = null, index: number = this.getMaxPos()): any[] {
        //Must override
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
    
    //Check is not illegal according to checks
    const turn: string = Game.fen2obj(fen).turn
    const wChecks: number = Chess.checks('w', fen)
    const bChecks: number = Chess.checks('b', fen)
    if ((turn === 'w' && bChecks > 0) || (turn === 'b' && wChecks > 0)) return false

    return true
    }    
      
}

export { Chess }