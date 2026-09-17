# Complete PRINT&PEEL storefront updates

## Goal
Finish the previously requested customer and order features, make every poster artwork available as a sticker, add dates to saved receipts, and label poster products as self-adhesive.

## What will change
- Add sticker versions of every poster design, keeping picture-based names and matching anime, cars, football, or other filters.
- Add any remaining uploaded designs that are not yet in the catalogue, with picture-based names and correct categories.
- Update every poster description and visible product detail to say “self-adhesive”.
- Apply the confirmed delivery rule: ₹50 below ₹230 and free delivery from ₹230, including the cart, checkout, WhatsApp order, and receipt totals.
- Add a locally saved customer profile with name, phone, email, and address details.
- Add a first-visit details prompt with save/skip actions, plus returning-customer shortcuts.
- Autofill checkout from saved profile details while keeping fields editable.
- Save completed orders locally with order ID, date, items, delivery, tax (0%), and total.
- Add an Orders page with newest-first history, receipt viewing, printing, downloading, copying, and reorder.
- Add a Profile page and navigation access to Profile and Orders.
- Add order summaries calculated only from real saved orders: total orders, total spent, favorite category, and latest order.
- Show the order date on the checkout receipt and all saved/downloaded receipts.

## Validation
- Check desktop and mobile layouts.
- Test catalogue filters, poster-as-sticker products, cart totals, checkout autofill, WhatsApp order link, dated receipt, saved order, copy/download/print, and reorder.
- Confirm every page has complete social and search metadata, then run the production build.

## Technical details
- Keep all customer, cart, wishlist, recent-view, and order data in browser storage; no account or cloud service is added.
- Receipt downloads will be printable HTML files so they work without adding a PDF dependency.
