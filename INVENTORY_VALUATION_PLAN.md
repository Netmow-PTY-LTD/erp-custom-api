# Inventory Valuation Options

This document outlines three distinct specific strategies for handling Cost of Goods Sold (COGS) and Inventory Valuation.

---

## Plan A: First-In, First-Out (FIFO)
**"The Most Accurate Way"**

*   **Concept**: The system assumes you sell your oldest inventory first. It tracks exactly which "batch" every unit belongs to. 
*   **Scenario Logic**:
    *   You sell 12 PCs.
    *   System takes 10 PCs from Batch A (Cost 120).
    *   System takes 2 PCs from Batch B (Cost 130).
    *   **COGS**: `(10 * 120) + (2 * 130) = 1,460 RM`
*   **Pros**: precise profit calculation; standard for expiring goods.
*   **Cons**: High complexity. Requires new `batches` table and complex logic to split sales across batches.

---

## Plan B: Weighted Average Cost (AVCO)
**"The Balanced Standard" (Recommended)**

*   **Concept**: The system calculates a single "Average Cost" for the product. This average is updated every time you buy new stock.
*   **Scenario Logic**:
    *   Total Value of all stock = `(10 * 120) + (5 * 130) = 1,850 RM`.
    *   Total Quantity = 15.
    *   New Average Cost = `1,850 / 15 = 123.33 RM`.
    *   **COGS**: `12 * 123.33 = 1,479.96 RM`
*   **Pros**: Smooths out price fluctuations; easier to manage than FIFO (no batches).
*   **Cons**: Requires strict logic to update average on every purchase receipt.

---

## Plan C: Last Purchase Price
**"The Simple Way"**

*   **Concept**: The cost of the product is simply updated to whatever you paid last. The system assumes *all* current stock is worth the new price.
*   **Scenario Logic**:
    *   You bought the last batch at 130 RM.
    *   Therefore, the system updates the Product Cost to **130 RM**.
    *   **COGS**: `12 * 130 = 1,560 RM`
*   **Pros**: Easiest to code. Just overwrite `product.cost` when buying.
*   **Cons**: Highly inaccurate.
    *   If you bought cheap stock (120) and market price goes up (130), this method artificially inflates your costs, making your profit look lower than it is.
    *   If price drops, it makes profit look higher.

---

## Recommendation
**Choose Plan B (Weighted Average)** for a robust ERP system that balances accuracy with maintainability. Plan A is overkill unless you strictly need batch tracking (serialization/expiration). Plan C is too inaccurate for serious accounting.
