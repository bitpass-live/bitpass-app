/**
 * Represents a discount code as returned by the API.
 */
export interface DiscountCode {
    /** UUID of the discount code */
    id: string;
    /** The alphanumeric code (max 10 chars) */
    code: string;
    /** Discount percentage (1–100) */
    percentage: number;
    /** Optional ISO timestamp when the code expires */
    expiresAt?: string;
    /** Optional maximum number of times the code can be used */
    maxUses?: number;
    /** ISO timestamp when this record was created */
    createdAt: string;
    /** ISO timestamp when this record was last updated */
    updatedAt: string;
}