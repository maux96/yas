
export interface YasConfig{
    changeTime: number,
    startEndAnimationTime: number,
    initialAnimationDirection: 1 | -1,
    amountElements: number,
    autoAnimation: boolean,
    slowMovementOffset: string,
    animation: string
}
export interface YasConfigChanger {
    changeTime?: number,
    startEndAnimationTime?: number,
    initialAnimationDirection?: 1 | -1,
    amountElements?: number,
    autoAnimation?: boolean,
    slowMovementOffset?: string,
    animation?: string
}

