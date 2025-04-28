export const allowedTransitions: Record<string, string[]> = {
    PENDING: ['PROCESSING', 'CACELLED', 'REJECTED'],
    PROCESSING: ['OUT_FOR_DLEIVERY', 'CANCELLED'],
    OUT_FOR_DELIVERY: ['COMPLETED']
}

//Record here denotes the shape of the parameter (key: value[]). so the object just defines transition of the statuses 