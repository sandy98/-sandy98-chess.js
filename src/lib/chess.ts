
import { Game, IMoveInfo as IMoveInfoBase, IFenObj } from './game'

export interface IMoveInfo extends IMoveInfoBase {
    isCheck: boolean
    isCheckMate: boolean
    isStaleMate: boolean
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
        return p.slice(0, p.length - 1)
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

    static canReach(from: number, to: number, fen: string): boolean {
      return Chess.inScope(from, to, fen) && Chess.isClearPath(from, to, fen)
    }

    static canAttack(from: number, to: number, fen: string): boolean {
        return Chess.inScope(from, to, fen, true) && Chess.isClearPath(from, to, fen)
    }


    san2MoveInfo(san: string): IMoveInfo {
        //Must override
        if (!san.length) return <IMoveInfo>null
        return <IMoveInfo>null
      }
  
      canMove(moveInfo: IMoveInfo, n: number = this.getMaxPos()): boolean {
        //Overriden version

        const parentResult = super.canMove(<IMoveInfoBase>moveInfo)
        if (!parentResult) return false
        //super.canMove() tests: 
        // 1) that the original figure is a valid one
        // 2) that the turn is correct
        // 3) that it's not "friendly fire", i.e. not moving over a friend figure.

        const result = Chess.canReach(moveInfo.from, moveInfo.to, this.fens[n])
        if (!result) return false
        
        //Todo: consider constraints for pawn actions and castling before returning true

        return true
      }

      game_over(): boolean {
        //Must override
        return false
      }
  

      in_check(index: number = this.getMaxPos()): boolean {
        //Must override
        if (index < 0 || index > this.getMaxPos()) return false
        return false
      }
  
      in_checkmate(index: number = this.getMaxPos()): boolean {
        //Must override
        if (index < 0 || index > this.getMaxPos()) return false
        return false
      }
  
      in_draw(index: number = this.getMaxPos()): boolean {
        //Must override
        if (index < 0 || index > this.getMaxPos()) return false
        return false
      }
  
      in_stalemate(index: number = this.getMaxPos()): boolean {
        //Must override
        if (index < 0 || index > this.getMaxPos()) return false
        return false
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
  
      moves(options: object = null): string[] {
        //Must override
        if (!!options) {
          return []
        } else {
          return []
        }
      } 

      validate_fen(fen: string): boolean {
        //Must override
        if (fen.length) return true
        return false
      }    
      
}

export { Chess }