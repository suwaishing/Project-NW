export interface INet {
    cashAndEquivalent: {
        cashOnHand: number
        cashInBank: number
    }
    realEstate: {
        house: number
        otherRealEstate: number
    }
    investment: {
        stock: number
        bond: number
        otherInvestment: number
    }
    personalAssets: {
        vehicle: number
        jewelry: number
        personalProperty: number
    }
    Liability: {
        mortgage: number
        loan: number
        creditCard: number
        studentLoans: number
        otherDebt: number
    }
    growth: {
        assetRatio: number
        debtRatio: number
    }
}
export interface INetResult {
    _cashAndEquivalent?: number
    _realEstate?: number
    _investment?: number
    _personalAssets?: number
    _Liability?: number
    ans?: number
    totalAsset?: number
}
