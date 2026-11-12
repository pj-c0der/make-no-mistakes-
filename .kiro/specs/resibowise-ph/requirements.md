# Requirements Document

## Introduction

ResiboWise PH is a mobile-first web application for Filipino household budget managers. It converts physical purchase receipts into verified digital transaction records using the hackathon organizers' Lumen OCR service, lets users search and maintain saved transactions, and shows recorded monthly spending in Philippine pesos (₱).

Core flow: receipt image → Lumen OCR → user verification → save transaction → searchable history → monthly recorded expenses.

The signature feature, ResiboVerify, shows the original receipt image next to the proposed transaction fields and requires the user to correct and explicitly confirm them before anything is saved. OCR output is never assumed to be accurate.

**Competition context.** The competition requires a working web application, at least one real Lumen tool, and a clearly identified Filipino user group. ResiboWise PH selects Lumen OCR as its Lumen tool. The identified user group is Filipino household budget managers. The safe submission deadline is 2:00 PM unless the organizers confirm otherwise. The team consists of two developers, BELLEN and CLAVITE.

**Status of this document.** This is a draft. It has not yet received final team approval.

**Lumen API contract is unverified.** The official Lumen API contract has not been verified. This document does not state any endpoint, authentication scheme, request or response schema, field name, confidence value, supported image format, file size limit, or rate limit as fact. Such details are recorded under Open Items. This document distinguishes three layers:

- **Lumen response**: whatever Lumen_OCR actually returns. Its structure is unknown until verified.
- **Normalized extraction result**: the application's own internal representation, produced from the Lumen response by the OCR_Proxy.
- **Parser-derived fields**: merchant name, purchase date, and payable total proposals that the application's parsing logic derives from the Lumen response. These are proposals, not facts reported by Lumen_OCR.

Requirements are organized into four groups:

- **Group A: Organizer-Confirmed Requirements.** Stated by the hackathon organizers.
- **Group B: Proposed Core MVP Requirements.** The core MVP, proposed by the team and not yet finally approved. These MUST be completed first.
- **Group C: Optional Enhancements.** These MUST NOT block completion of the MVP.
- **Group D: Provisional Technical Assumptions.** Technical direction that is not confirmed and may change at design time.

## Glossary

- **ResiboWise_App**: The mobile-first web application described by this document, including its browser client and its server-side OCR integration.
- **Lumen_OCR**: The OCR service provided by the hackathon organizers. Its API contract is an Open Item.
- **Lumen_Response**: The data that Lumen_OCR actually returns for a submitted Receipt_Image. Its structure is unverified.
- **OCR_Proxy**: The server-side component of ResiboWise_App that sends Receipt_Images to Lumen_OCR so that credentials are never exposed to the browser.
- **Receipt_Image**: An image file of a physical purchase receipt that the user uploads or captures.
- **Supported_Image_Type**: A Receipt_Image file format accepted by ResiboWise_App. The list is read from configuration and is an Open Item until verified.
- **Maximum_Image_Size**: The largest Receipt_Image file size accepted by ResiboWise_App. The value is read from configuration and is an Open Item until verified.
- **Normalized_Extraction**: The application's internal representation of the outcome of one OCR attempt, produced by the OCR_Proxy from the Lumen_Response. It contains the recognized text (if any) and zero or more Parser_Derived_Fields. It does not assume that Lumen_OCR returns structured fields, confidence values, or alternative candidates.
- **Parser_Derived_Field**: A proposed merchant name, purchase date, or Payable_Total produced by the application's parsing logic from the Lumen_Response. Each is marked as proposed or missing.
- **Draft_Transaction**: An unsaved transaction, populated from Parser_Derived_Fields or empty for manual entry, and editable by the user.
- **Transaction**: A confirmed, saved record consisting of merchant name, purchase date, and Payable_Total. A Transaction MAY also hold a Category and a retained Receipt_Image when those optional enhancements are enabled.
- **Payable_Total**: The final amount the customer is required to pay on a receipt, as opposed to a subtotal, tax line, cash tendered, or change.
- **Amount**: A monetary value in Philippine pesos (PHP), stored as an integer number of centavos (or an equivalent representation free of binary floating-point error) and having at most two decimal places when entered or displayed.
- **ResiboVerify**: The review step in which the user views the original Receipt_Image, inspects the proposed fields, corrects them, and explicitly confirms before saving.
- **Local_Store**: The browser-local storage mechanism holding saved Transactions on the user's device.
- **Dashboard**: The view showing recorded expenses for a selected calendar month.
- **Selected_Month**: The calendar month (year and month) chosen for display on the Dashboard. It defaults to the current month in the Asia/Manila time zone.
- **Category**: A single user-editable label assigned to one Transaction (optional enhancement).
- **Monthly_Budget**: A single overall spending limit in PHP set by the user for a calendar month (optional enhancement).
- **Open_Item**: A dependency or decision that is unresolved and must be verified or decided before it is treated as fact.

## Requirements

### Group A: Organizer-Confirmed Requirements

The organizers require at least one real Lumen tool. ResiboWise PH selects Lumen OCR as that tool.

### Requirement 1: Use the Organizers' Lumen OCR Service

**User Story:** As a household budget manager, I want my receipts read by the official hackathon OCR service, so that extraction is performed by the organizer-approved technology.

#### Acceptance Criteria

1. WHEN a user submits a valid Receipt_Image for processing, THE OCR_Proxy SHALL send the Receipt_Image to the actual Lumen_OCR service.
2. THE ResiboWise_App SHALL derive every Normalized_Extraction from a Lumen_Response.
3. IF Lumen_OCR is unavailable, THEN THE ResiboWise_App SHALL display an error message that states the receipt could not be read and SHALL offer manual entry of the transaction.
4. THE ResiboWise_App SHALL use only real Lumen_OCR output in the submitted build, except in development and automated test configurations that are clearly labeled as using mocked output.

### Group B: Proposed Core MVP Requirements

This group is the proposed core MVP. It has not yet received final team approval.

### Requirement 2: Receipt Image Intake

**User Story:** As a household budget manager, I want to upload or capture a photo of my receipt, so that I can start recording a purchase without typing everything.

#### Acceptance Criteria

1. THE ResiboWise_App SHALL allow the user to select a Receipt_Image from the device's files.
2. WHERE the device provides camera access, THE ResiboWise_App SHALL allow the user to capture a Receipt_Image with the device camera.
3. WHEN the user selects a Receipt_Image, THE ResiboWise_App SHALL display a preview of the Receipt_Image before processing begins.
4. WHEN the user selects a Receipt_Image, THE ResiboWise_App SHALL validate the file type against the Supported_Image_Type list and the file size against the Maximum_Image_Size before submitting the file.
5. IF the selected file is not a Supported_Image_Type, THEN THE ResiboWise_App SHALL reject the file and display a message listing the supported types.
6. IF the selected file exceeds the Maximum_Image_Size, THEN THE ResiboWise_App SHALL reject the file and display a message stating the maximum allowed size.
7. IF the selected file has a Supported_Image_Type but its contents cannot be decoded as an image, THEN THE ResiboWise_App SHALL reject the file and display a message stating the file is not a readable image.

### Requirement 3: OCR Processing and Normalized Extraction

**User Story:** As a household budget manager, I want the app to read my receipt and propose a merchant, date, and total, so that I save time entering data.

#### Acceptance Criteria

1. WHEN the user starts processing a valid Receipt_Image, THE ResiboWise_App SHALL send the Receipt_Image to the OCR_Proxy and display a loading indicator until a result or an error is returned.
2. WHEN Lumen_OCR returns a Lumen_Response, THE OCR_Proxy SHALL produce a Normalized_Extraction without requiring the Lumen_Response to contain structured merchant, date, or total fields.
3. WHEN the OCR_Proxy produces a Normalized_Extraction, THE OCR_Proxy SHALL mark each of the merchant name, purchase date, and Payable_Total as either proposed or missing.
4. THE ResiboWise_App SHALL present each proposed field as a suggestion that the user must review, and SHALL NOT present any field as reported by Lumen_OCR unless the verified Lumen_Response contract confirms that Lumen_OCR reports it.
5. IF the Lumen_Response contains no readable text for the Receipt_Image, THEN THE ResiboWise_App SHALL display a message that the receipt is unreadable and SHALL offer reselecting the image or manual entry.
6. IF Lumen_OCR returns an error or a response that the OCR_Proxy cannot interpret, THEN THE ResiboWise_App SHALL display a message that processing failed and SHALL offer retry and manual entry.
7. IF Lumen_OCR does not respond within the configured processing timeout, THEN THE ResiboWise_App SHALL stop waiting, display a timeout message, and offer retry and manual entry.
8. WHILE a processing request for a Receipt_Image is in progress, THE ResiboWise_App SHALL disable the process action for that Receipt_Image so that no second request is submitted.

### Requirement 4: Payable Total Proposal and User Selection

**User Story:** As a household budget manager, I want the app to propose a total only when it is clearly supported and otherwise ask me, so that I never save a wrong amount by accident.

#### Acceptance Criteria

1. WHERE the application's parsing logic finds exactly one clearly supported Payable_Total in the Lumen_Response, THE ResiboWise_App MAY propose that value in the Draft_Transaction.
2. IF the parsing logic finds several plausible monetary values or cannot establish the Payable_Total reliably, THEN THE ResiboWise_App SHALL leave the Payable_Total empty and SHALL require the user to enter it manually or to select one of the values shown from the receipt text.
3. THE ResiboWise_App SHALL NOT propose a value as the Payable_Total merely because the value appears in the Lumen_Response, including a value that the receipt text identifies as a subtotal, tax, cash tendered, or change.
4. THE ResiboWise_App SHALL NOT claim or imply that a proposed Payable_Total is correct before the user confirms the Draft_Transaction.

### Requirement 5: ResiboVerify Review and Correction

**User Story:** As a household budget manager, I want to compare the receipt with the proposed data and fix any mistakes, so that my records are correct.

#### Acceptance Criteria

1. WHEN a Normalized_Extraction is available, THE ResiboVerify step SHALL display the original Receipt_Image together with the Draft_Transaction.
2. THE ResiboVerify step SHALL allow the user to edit the merchant name, purchase date, and Payable_Total of the Draft_Transaction.
3. WHEN a field is missing from the Normalized_Extraction, THE ResiboVerify step SHALL display that field as empty and visibly marked as requiring user input.
4. THE ResiboVerify step SHALL NOT mark any Draft_Transaction field as verified until the user has confirmed the Draft_Transaction.
5. WHERE the user chooses manual entry, THE ResiboVerify step SHALL present an empty Draft_Transaction through the same review and validation rules.
6. THE ResiboVerify step SHALL keep the original Receipt_Image viewable during verification regardless of whether the Receipt_Image is retained after saving.

### Requirement 6: Validation of Financial Fields

**User Story:** As a household budget manager, I want the app to block invalid entries, so that my totals are never corrupted.

#### Acceptance Criteria

1. IF the Payable_Total is empty, THEN THE ResiboWise_App SHALL disable saving and display a message that the total is required.
2. IF the Payable_Total is not a valid Amount, THEN THE ResiboWise_App SHALL disable saving and display a message describing the valid format.
3. IF the Payable_Total is zero or negative, THEN THE ResiboWise_App SHALL disable saving and display a message that the total must be greater than zero.
4. IF the Payable_Total has more than two decimal places, THEN THE ResiboWise_App SHALL disable saving and display a message that PHP amounts allow at most two decimal places.
5. IF the purchase date is empty or is not a valid calendar date, THEN THE ResiboWise_App SHALL disable saving and display a message that a valid purchase date is required.
6. IF the purchase date is later than the current date in the Asia/Manila time zone, THEN THE ResiboWise_App SHALL disable saving and display a message that the purchase date cannot be in the future.
7. IF the merchant name is empty or contains only whitespace, THEN THE ResiboWise_App SHALL disable saving and display a message that the merchant name is required.
8. THE ResiboWise_App SHALL apply the same validation rules to Draft_Transactions created from OCR, from manual entry, and from editing a saved Transaction.

### Requirement 7: Explicit Confirmation Before Saving

**User Story:** As a household budget manager, I want to confirm a transaction myself, so that nothing is recorded without my approval.

#### Acceptance Criteria

1. THE ResiboWise_App SHALL save a Transaction only after the user activates an explicit confirm action on a valid Draft_Transaction.
2. WHEN OCR processing completes, THE ResiboWise_App SHALL leave the Draft_Transaction unsaved.
3. WHEN the user confirms a valid Draft_Transaction, THE ResiboWise_App SHALL write the Transaction to the Local_Store and display a success message.
4. WHEN the user activates the confirm action more than once for the same Draft_Transaction, THE ResiboWise_App SHALL save exactly one Transaction.
5. WHEN the user leaves ResiboVerify with unsaved changes, THE ResiboWise_App SHALL ask the user to confirm discarding the Draft_Transaction.

### Requirement 8: Local Persistence of Transactions

**User Story:** As a household budget manager, I want my saved transactions to remain on my device, so that I can view them later without creating an account.

#### Acceptance Criteria

1. WHEN a Transaction is confirmed, THE Local_Store SHALL persist the unique identifier, merchant name, purchase date, and Amount of the Transaction.
2. WHEN the user reloads the ResiboWise_App, THE ResiboWise_App SHALL load all previously saved Transactions from the Local_Store.
3. THE ResiboWise_App SHALL store Amounts as integer centavos or in an equivalent representation that preserves exact centavo values.
4. THE ResiboWise_App SHALL save a Transaction successfully without a Receipt_Image, because retaining the Receipt_Image is optional (see Requirement 19).
5. IF the Local_Store is unavailable, full, or returns a write error, THEN THE ResiboWise_App SHALL display an error message, SHALL keep the Draft_Transaction on screen, and SHALL NOT report the Transaction as saved.
6. IF the Local_Store contains data that cannot be parsed or fails validation, THEN THE ResiboWise_App SHALL display a recovery message and SHALL NOT overwrite the unreadable data without user confirmation.
7. THE ResiboWise_App SHALL inform the user that Transactions are stored only in the current browser on the current device and can be lost if browser data is cleared.
8. FOR ALL valid Transactions, writing the Transaction to the Local_Store and then reading it back SHALL produce an equivalent Transaction (round-trip property).

### Requirement 9: Transaction List, Search, Edit, and Delete

**User Story:** As a household budget manager, I want to find, correct, and remove past records, so that my history stays accurate.

#### Acceptance Criteria

1. THE ResiboWise_App SHALL display saved Transactions in a list ordered by purchase date, newest first.
2. WHEN the user enters a search term, THE ResiboWise_App SHALL display only Transactions whose merchant name contains the term, ignoring letter case.
3. WHEN the user clears the search term, THE ResiboWise_App SHALL display all saved Transactions.
4. IF no Transaction matches the search term, THEN THE ResiboWise_App SHALL display a no-results message that includes the search term.
5. WHEN the user chooses to edit a Transaction, THE ResiboWise_App SHALL open the Transaction in the same validated form used by ResiboVerify.
6. WHEN the user saves a valid edit, THE ResiboWise_App SHALL update the Transaction in the Local_Store and display a success message.
7. WHEN the user chooses to delete a Transaction, THE ResiboWise_App SHALL ask for confirmation before removing the Transaction.
8. WHEN the user confirms deletion, THE ResiboWise_App SHALL remove the Transaction from the Local_Store and display a success message.
9. IF no Transactions are saved, THEN THE ResiboWise_App SHALL display an empty state that invites the user to add a receipt.

### Requirement 10: Monthly Expense Dashboard

**User Story:** As a household budget manager, I want to see how much I recorded spending this month, so that I understand my expenses.

#### Acceptance Criteria

1. WHEN the Dashboard is opened, THE ResiboWise_App SHALL set the Selected_Month to the current month in the Asia/Manila time zone.
2. THE Dashboard SHALL display the sum of the Amounts of all Transactions whose purchase date falls within the Selected_Month, formatted in PHP (for example, ₱1,234.50).
3. THE Dashboard SHALL display the count of Transactions included in the Selected_Month total.
4. WHEN the user selects a different month, THE Dashboard SHALL recalculate the total and count for that month.
5. THE ResiboWise_App SHALL calculate sums using integer-centavo or equivalent exact arithmetic so that the displayed total equals the exact sum of the stored Amounts.
6. THE Dashboard SHALL label its totals as recorded expenses, indicating that only saved Transactions are included.
7. IF no Transactions fall within the Selected_Month, THEN THE Dashboard SHALL display a total of ₱0.00, a count of 0, and an empty-state message.

### Requirement 11: Totals Stay Consistent After Changes

**User Story:** As a household budget manager, I want totals to update when I save, edit, or delete records, so that the Dashboard always matches my saved data.

#### Acceptance Criteria

1. WHEN a Transaction is saved, edited, or deleted, THE ResiboWise_App SHALL update the Dashboard totals without requiring a page reload.
2. WHEN the purchase date of a Transaction is edited into a different month, THE ResiboWise_App SHALL remove its Amount from the previous month's total and add the Amount to the new month's total.
3. WHEN the Amount of a Transaction is edited, THE ResiboWise_App SHALL change the total of its month by exactly the difference between the new and old Amounts.
4. WHEN a Transaction is deleted, THE ResiboWise_App SHALL decrease the total of its month by exactly the Amount of the deleted Transaction.
5. FOR ALL sets of saved Transactions, THE Dashboard total for a month SHALL equal the sum of the Amounts of the Transactions in that month (invariant).
6. WHEN the last Transaction in a month is deleted or moved to another month, THE Dashboard SHALL display the zero-transaction state for that month.

### Requirement 12: Responsive Layout and Accessibility Baseline

**User Story:** As a household budget manager, I want the app to work on my phone and on a desktop, so that I can use it wherever I am.

#### Acceptance Criteria

1. THE ResiboWise_App SHALL render all core views without horizontal scrolling at viewport widths from 360 px to 1920 px.
2. WHILE the viewport width is less than 768 px, THE ResiboWise_App SHALL present a single-column layout with touch targets of at least 44 by 44 CSS pixels.
3. WHILE the viewport width is 768 px or greater, THE ResiboVerify step SHALL present the Receipt_Image and the Draft_Transaction side by side.
4. THE ResiboWise_App SHALL allow every core action (add, review, confirm, search, edit, delete, view Dashboard) to be completed using only touch input and using only keyboard input.

### Requirement 13: Loading, Empty, Success, and Error States

**User Story:** As a household budget manager, I want clear feedback on what the app is doing, so that I know whether my action worked.

#### Acceptance Criteria

1. WHILE a Receipt_Image is being processed, THE ResiboWise_App SHALL display a loading indicator.
2. WHEN a save, edit, or delete operation succeeds, THE ResiboWise_App SHALL display a success message.
3. WHEN an operation fails, THE ResiboWise_App SHALL display an error message that states what failed and what the user can do next.
4. WHEN a list or the Dashboard has no data to show, THE ResiboWise_App SHALL display an empty state with a suggested next action.
5. THE ResiboWise_App SHALL convey success, error, and loading states with text in addition to color.

### Requirement 14: Security and Privacy of the OCR Integration

**User Story:** As a household budget manager, I want my receipt data and the organizers' service credentials protected, so that my information and the shared service are not misused.

#### Acceptance Criteria

1. THE OCR_Proxy SHALL hold all Lumen_OCR credentials on the server side only.
2. THE ResiboWise_App SHALL exclude Lumen_OCR credentials from browser-delivered code, network responses to the browser, source control, and logs.
3. WHEN the OCR_Proxy receives a request, THE OCR_Proxy SHALL validate the file type and file size on the server regardless of browser-side validation.
4. THE OCR_Proxy SHALL accept only the HTTP methods and content types required for receipt submission.
5. THE OCR_Proxy SHALL enforce a configurable limit on the number of OCR requests accepted from one client within a time window, using a mechanism that remains effective when the OCR_Proxy runs as multiple instances or as short-lived serverless invocations. The mechanism and limit values are decided in the design phase.
6. IF a client exceeds the OCR request limit, THEN THE OCR_Proxy SHALL reject the request with a message that tells the user to try again later.
7. THE OCR_Proxy SHALL exclude Receipt_Image contents and recognized text from persistent storage and logs.
8. THE OCR_Proxy SHALL return error messages that exclude credentials, internal paths, and raw upstream error bodies.
9. THE ResiboWise_App SHALL tell the user, before the first submission, that the Receipt_Image will be sent to a server and to Lumen_OCR for processing and that receipts may contain sensitive information.
10. THE ResiboWise_App SHALL render all OCR-derived and user-entered text as plain text so that receipt content cannot execute as markup or script.

### Group C: Optional Enhancements

These requirements MUST NOT block completion or demonstration of Group A and Group B. They are implemented only after the MVP is working. Each requirement applies only where its enhancement is enabled.

### Requirement 15: Transaction Category

**User Story:** As a household budget manager, I want to assign one category to each receipt, so that I can see what kind of spending I do.

#### Acceptance Criteria

1. WHERE the category enhancement is enabled, THE ResiboWise_App SHALL allow the user to assign at most one Category to a Draft_Transaction or a saved Transaction.
2. WHERE the category enhancement is enabled, THE ResiboWise_App SHALL provide a default list of Categories and allow the user to type a custom Category.
3. WHERE the category enhancement is enabled, THE ResiboWise_App SHALL allow the user to change or clear the Category of a saved Transaction.
4. WHERE the category enhancement is enabled, THE ResiboWise_App SHALL treat a Transaction without a Category as uncategorized and include the Transaction in all totals.
5. WHERE the category enhancement is enabled, THE ResiboWise_App SHALL include the Category in the text matched by search.

### Requirement 16: Monthly Budget

**User Story:** As a household budget manager, I want to set a monthly budget, so that I can see how much I have left to spend.

#### Acceptance Criteria

1. WHERE the budget enhancement is enabled, THE ResiboWise_App SHALL allow the user to set one Monthly_Budget Amount greater than zero for a month.
2. WHERE the budget enhancement is enabled, THE Dashboard SHALL display the Selected_Month recorded expenses as an Amount used and as a percentage of the Monthly_Budget.
3. WHERE the budget enhancement is enabled, THE Dashboard SHALL display the remaining Amount as the Monthly_Budget minus the recorded expenses.
4. WHERE the budget enhancement is enabled, WHEN recorded expenses exceed the Monthly_Budget, THE Dashboard SHALL display the overspent Amount and an over-budget indicator that uses text in addition to color.
5. WHERE the budget enhancement is enabled, IF the user enters a Monthly_Budget that is empty, zero, negative, or has more than two decimal places, THEN THE ResiboWise_App SHALL reject the value and display a validation message.
6. WHERE the budget enhancement is enabled, WHEN a Transaction is saved, edited, or deleted, THE Dashboard SHALL update the used and remaining budget figures without a page reload.
7. WHERE the budget enhancement is enabled, THE ResiboWise_App SHALL persist the Monthly_Budget in the Local_Store.

### Requirement 17: Possible Duplicate Warning

**User Story:** As a household budget manager, I want to be warned about a likely duplicate, so that I do not record the same receipt twice.

#### Acceptance Criteria

1. WHERE the duplicate warning enhancement is enabled, WHEN a Draft_Transaction has the same merchant name, purchase date, and Amount as a saved Transaction, THE ResiboVerify step SHALL display a warning that identifies the matching Transaction.
2. WHERE the duplicate warning enhancement is enabled, THE ResiboVerify step SHALL compare merchant names without regard to letter case or surrounding whitespace.
3. WHERE the duplicate warning enhancement is enabled, WHEN the user edits the merchant name, purchase date, or Payable_Total, THE ResiboVerify step SHALL re-evaluate the duplicate warning.
4. WHERE the duplicate warning enhancement is enabled, THE ResiboVerify step SHALL allow the user to save the Draft_Transaction after acknowledging the warning.

### Requirement 18: Category Spending Visualization

**User Story:** As a household budget manager, I want a simple chart of spending by category, so that I can see where my money goes.

#### Acceptance Criteria

1. WHERE the category visualization enhancement is enabled, THE Dashboard SHALL display the Selected_Month recorded expenses grouped by Category.
2. WHERE the category visualization enhancement is enabled, THE Dashboard SHALL display uncategorized spending as its own group.
3. WHERE the category visualization enhancement is enabled, THE Dashboard SHALL provide the figures behind the visualization as text or a table.
4. WHERE the category visualization enhancement is enabled, THE Dashboard SHALL show group totals whose sum equals the Selected_Month total (invariant).

### Requirement 19: Optional Receipt Image Retention

**User Story:** As a household budget manager, I want to optionally keep the receipt photo with a transaction, so that I can look at the original later.

#### Acceptance Criteria

1. WHERE the image retention enhancement is enabled, THE ResiboWise_App SHALL allow the user to retain the Receipt_Image with a Transaction when saving.
2. WHERE the image retention enhancement is enabled, THE ResiboWise_App MAY downscale or compress the Receipt_Image before storing it.
3. WHERE the image retention enhancement is enabled, IF the Local_Store cannot hold the Receipt_Image, THEN THE ResiboWise_App SHALL save the Transaction without the Receipt_Image and SHALL tell the user that the image was not retained.
4. WHERE the image retention enhancement is enabled, WHEN a Transaction with a retained Receipt_Image is deleted, THE ResiboWise_App SHALL remove the retained Receipt_Image from the Local_Store.

### Requirement 20: Receipt Image Zoom

**User Story:** As a household budget manager, I want to zoom into the receipt photo, so that I can read small print.

#### Acceptance Criteria

1. WHERE the zoom enhancement is enabled, THE ResiboVerify step SHALL allow the user to zoom the displayed Receipt_Image.
2. WHERE the zoom enhancement is enabled, THE ResiboVerify step SHALL provide zoom controls operable by touch and by keyboard.

### Requirement 21: Ambiguity Warnings

**User Story:** As a household budget manager, I want to be warned when the proposed amount looks doubtful, so that I double-check before saving.

#### Acceptance Criteria

1. WHERE the ambiguity warning enhancement is enabled and the application's parsing logic can detect the condition reliably, THE ResiboVerify step SHALL display a warning next to the Payable_Total field.
2. WHERE the ambiguity warning enhancement is enabled, WHEN the user edits the Payable_Total, THE ResiboVerify step SHALL re-evaluate the warning for the new value.
3. WHERE the ambiguity warning enhancement is enabled, THE ResiboVerify step SHALL allow the user to save a valid Draft_Transaction while a warning is displayed.
4. THE ResiboWise_App SHALL base ambiguity warnings only on conditions that the implemented parser can detect, and SHALL NOT use confidence scores unless the verified Lumen_Response contract provides them.

### Requirement 22: Offline Handling

**User Story:** As a household budget manager, I want to be told when I am offline, so that I understand why receipt processing is unavailable.

#### Acceptance Criteria

1. WHERE the offline handling enhancement is enabled, WHEN the browser reports that the device is offline, THE ResiboWise_App SHALL tell the user that receipt processing requires a connection.
2. WHERE the offline handling enhancement is enabled, WHILE the device is offline, THE ResiboWise_App SHALL keep viewing, searching, editing, and deleting saved Transactions available.

### Group D: Provisional Technical Assumptions

These items guide design but are not confirmed. Each may be revised in the design phase with justification.

### Requirement 23: Provisional Technology Direction

**User Story:** As a two-person hackathon team, I want an agreed starting stack, so that we can build quickly without re-deciding fundamentals.

#### Acceptance Criteria

1. THE ResiboWise_App SHALL be implemented as a React and TypeScript single-page application built with Vite.
2. THE ResiboWise_App SHALL use Tailwind CSS for styling and MAY use selected shadcn/ui components.
3. THE OCR_Proxy SHALL be implemented as a server-side function or service deployable alongside the web client.
4. WHERE the hosting platform is compatible with the OCR_Proxy and Lumen_OCR, THE ResiboWise_App SHALL be deployed on Vercel.
5. THE ResiboWise_App SHALL operate without user accounts, authentication, a hosted database, or custom machine-learning models, unless a justified need is recorded in the design document.

### Requirement 24: Configurable Limits and Display Formats

**User Story:** As a two-person hackathon team, I want limits kept in one place and display formats fixed, so that validation can be built before the organizer documentation is verified.

#### Acceptance Criteria

1. THE ResiboWise_App SHALL read the Supported_Image_Type list, the Maximum_Image_Size, the processing timeout, and the OCR request limit from a single configuration location.
2. WHEN the verified Lumen_OCR documentation specifies a limit that conflicts with a configured value, THE ResiboWise_App SHALL use the stricter of the two values.
3. THE ResiboWise_App SHALL display dates in the format day, month name, year (for example, 05 March 2025) and SHALL store dates in the ISO 8601 calendar date format.
4. THE ResiboWise_App SHALL interpret "today" and month boundaries using the Asia/Manila time zone.
5. THE ResiboWise_App SHALL format Amounts with the peso sign (₱), thousands separators, and exactly two decimal places.

## Open Items

These items MUST be resolved from verified sources or by team decision before they are treated as fact. They are not requirements.

### Lumen Integration Dependencies

1. **Lumen API contract (blocking).** Obtain from verified organizer documentation: endpoint and access method, authentication scheme, request format, response structure, and error format. No such detail is assumed in this document.
2. **Lumen output content.** Confirm whether Lumen_OCR returns plain text only, text with positions, structured fields, confidence values, or alternative candidates. Until confirmed, only plain recognized text is assumed possible.
3. **Supported image formats and size limits.** Obtain from verified documentation; the Supported_Image_Type list and Maximum_Image_Size remain unset until then.
4. **Rate limits and quotas.** Obtain the Lumen limits and decide the application's own OCR request limit.
5. **Credential delivery.** Confirm how credentials are issued to the team and whether they may be used from a Vercel-hosted server function.
6. **Data handling terms.** Confirm whether the organizers restrict retention or use of submitted receipt images.
7. **Hosting compatibility.** Confirm that Vercel function limits (payload size, execution time) are compatible with the Lumen interaction.

### Team Decisions

8. **Final approval of Group B.** Both developers (BELLEN and CLAVITE) must approve the Proposed Core MVP scope.
9. **Payable_Total proposal rules.** Decide, using sample Philippine receipts (including VAT lines and Senior Citizen/PWD discounts), which receipt layouts the parser supports and when it proposes a value versus requires user selection.
10. **Rate-limiting mechanism.** Decide in the design phase an abuse-protection mechanism that works across serverless instances, and its limit values.
11. **Processing timeout.** Decide the timeout value.
12. **Image retention.** Decide whether the optional retention enhancement is built at all, and if so whether images are stored, downscaled, or omitted given browser storage limits.
13. **Optional enhancements.** Decide which Group C requirements, if any, are attempted, and in what order.
14. **Duplicate matching rules.** Decide exact matching rules if Requirement 17 is attempted.
15. **Deadline.** Treat 2:00 PM as the safe submission deadline until the organizers confirm otherwise; record any organizer confirmation here.
16. **Currency scope.** This specification supports PHP only; multi-currency is out of scope.

## Out of Scope

- User accounts, authentication, and cross-device synchronization.
- Hosted databases and cloud backup of Transactions.
- Custom machine-learning models and Python services.
- Line-item extraction, receipt tax reporting, and multi-currency support.
- Mandatory permanent archiving of Receipt_Images (retention is optional; see Requirement 19).
- Export and import of data (may be considered after the MVP).

## Suggested Delivery Priority

1. Requirements 1–7 (Lumen OCR use, intake, OCR proxy, Payable_Total handling, ResiboVerify, validation, confirmation).
2. Requirements 8–11 (persistence, list/search/edit/delete, Dashboard, consistent totals).
3. Requirements 12–14 (responsive layout, states, security hardening).
4. Group C enhancements (Requirements 15–22), only if the MVP is complete.
