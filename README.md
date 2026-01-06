# POS Studio Website

A full-featured Point of Sale (POS) system for photo studios, designed to manage photo frames, photo prints, customized gifts, and more. Built with Next.js, TypeScript, Tailwind CSS, and localStorage for data persistence.

## 🚀 Deployment

This application is configured for deployment to GitHub Pages. Follow these steps to deploy:

1. **Enable GitHub Pages**:
   - Go to your repository's Settings > Pages
   - Set source to `gh-pages` branch and `/ (root)` folder
   - Click Save

2. **Set up GitHub Secrets** (Optional, for automated deployment):
   - Go to repository Settings > Secrets and variables > Actions
   - Add a new repository secret named `PERSONAL_ACCESS_TOKEN` with a GitHub personal access token that has `repo` and `workflow` permissions

3. **Manual Deployment**:
   ```bash
   # Install dependencies
   npm install
   
   # Build the project
   npm run build
   
   # Deploy to GitHub Pages
   npm run deploy
   ```

4. **Access Your Site**:
   Your site will be available at: `https://[your-github-username].github.io/pos`

## Features

### Multi-Shop System
- Create multiple independent shops with unique URLs (`/shop/[shopId]`)
- Each shop has its own password protection
- Separate data storage per shop in localStorage

### Password Protection
- Passwords stored in JavaScript code (visible in browser dev tools as requested)
- Session-based authentication
- Password prompt on first visit to shop URL

### Product Management
- **Templates**: Pre-defined categories (Photo Frames, Photo Prints, Customized Gifts)
- **Size Options**: Configurable sizes with individual pricing
  - Photo Frames: 4x6, 5x7, 8x10, 11x14, 16x20, etc.
  - Photo Prints: Same size options with print-specific pricing
- **Custom Products**: Create any product with custom pricing
- Full CRUD operations for products

### Full POS Features
- **Product Catalog**: Browse products by category with size selection
- **Shopping Cart**: Add products with quantities and sizes
- **Checkout**: Customer info, payment methods, discounts, taxes
- **Sales History**: Complete transaction records with search and filters
- **Inventory Tracking**: Stock levels per product/size with low stock alerts
- **Customer Management**: Customer database with purchase history
- **Reports**: Sales reports, revenue tracking, product performance
- **Receipts**: Printable/exportable receipts with customizable header/footer
- **Employee Management**: Multiple users with roles (admin, manager, cashier)
- **Discounts**: Percentage and fixed amount discounts
- **Taxes**: Configurable tax rates

### Data Management
- **LocalStorage**: All shop data stored in browser localStorage
- **Export**: JSON export of all shop data (products, sales, customers, settings)
- **Import**: Restore shop from exported JSON file
- **Backup**: Manual backup/restore functionality for device migration

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Creating a Shop

1. Navigate to the home page (`/`)
2. Fill in the "Create New Shop" form:
   - **Shop ID**: Unique identifier (letters, numbers, hyphens only)
   - **Shop Name**: Display name for your shop
   - **Password**: Password to protect shop access
3. Click "Create Shop"
4. You'll be redirected to your shop's home page

### Setting Up Passwords

When you create a shop, the password is stored in localStorage for immediate use. For permanent storage (survives browser cache clear), manually add the password to `lib/password.ts`:

```typescript
export const SHOP_PASSWORDS: Record<string, string> = {
  'your-shop-id': 'your-password',
  // Add more shops here
};
```

### Accessing Your Shop

1. Go to `/shop/[your-shop-id]`
2. Enter the password when prompted
3. Choose to open POS or Dashboard

### Using the POS

1. Click "Point of Sale" from shop home
2. Browse products in the catalog
3. Select size (if applicable) and click "Add to Cart"
4. Review cart and proceed to checkout
5. Enter customer info (optional), apply discounts, select payment method
6. Complete transaction to generate receipt

### Managing Products

1. Go to Dashboard → Products
2. Create products using templates or custom products
3. For Photo Frames/Prints: Add sizes with individual prices
4. For Customized Gifts: Set a base price
5. Edit or delete products as needed

### Managing Inventory

1. Go to Dashboard → Inventory
2. View current stock levels
3. Update stock by clicking "Update" on any item
4. Set minimum stock levels to receive alerts

### Viewing Reports

1. Go to Dashboard → Reports
2. View revenue statistics, top products, and performance metrics
3. Filter by date ranges (coming soon)

### Backup & Restore

1. Go to Dashboard → Settings → Backup & Restore
2. **Export**: Click "Download Backup" to save all shop data as JSON
3. **Import**: Select a backup file and click "Import Backup" to restore data

**Warning**: Importing will replace all current data for the shop!

## Project Structure

```
pos/
├── app/                    # Next.js app router pages
│   ├── shop/[shopId]/     # Dynamic shop routes
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── pos/           # POS interface
│   │   └── receipt/       # Receipt pages
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── shop/              # Shop-related components
│   ├── pos/               # POS components
│   ├── dashboard/         # Dashboard components
│   └── common/            # Shared components
├── lib/                   # Utility functions
│   ├── storage.ts         # LocalStorage utilities
│   ├── password.ts       # Password management
│   ├── shop-data.ts      # Shop data operations
│   └── products.ts       # Product templates
├── hooks/                 # React hooks
├── types/                 # TypeScript types
└── public/                # Static assets
```

## Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Storage**: localStorage/sessionStorage
- **State Management**: React Context + Hooks

## Security Notes

- Passwords are stored in JavaScript code (visible in browser dev tools - as requested)
- No backend validation (frontend-only application)
- Data stored locally in browser (privacy consideration)
- Export/import for backup (user responsibility)

## Browser Compatibility

- Modern browsers with localStorage support
- Recommended: Chrome, Firefox, Safari, Edge (latest versions)

## Data Storage

All data is stored in browser localStorage with the following keys:
- `pos_shops_list`: List of all shops
- `pos_shop_data_[shopId]`: Individual shop data
- `pos_password_[shopId]`: Shop passwords (temporary)
- `pos_session_[shopId]`: Session authentication

## License

This project is open source and available for use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.
