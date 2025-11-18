# 🕐 Clockify Exporter

A beautiful, modern web application to export your Clockify time tracking records to Excel. Built with vanilla JavaScript, responsive design, and a clean UI.

## Features

✨ **Modern & Clean UI**
- Beautiful gradient interface with smooth animations
- Responsive design works on desktop, tablet, and mobile
- Dark mode support ready

🔐 **Secure API Integration**
- Direct integration with Clockify API v8
- API key stored locally in browser (never sent to third-party servers)
- Toggle password visibility for easy API key entry

📊 **Time Entry Export**
- Fetch time entries for any date range
- Support for multiple workspaces
- View records in an interactive preview table
- Export to professional Excel format (.xlsx)

⚙️ **Advanced Features**
- Include/exclude task descriptions in export
- Total time calculation
- Summary statistics
- Loading indicators and status messages
- Error handling with user-friendly messages

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Clockify account with API key
- No server required - runs entirely in the browser!

### Installation

1. **Clone or download the project:**
   ```bash
   git clone <your-repo-url>
   cd clockify_expoter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   The server will start at `http://localhost:3000`

4. **Open in browser:**
   - Navigate to `http://localhost:3000` in your web browser
   - The app will automatically load and be ready to use

### How to Use

1. **Get Your API Key:**
   - Go to [Clockify Settings](https://app.clockify.me/user/settings)
   - Scroll down to "API" section
   - Copy your API key

2. **Enter Configuration:**
   - Paste your API key in the "API Key" field
   - Select your date range
   - Choose your workspace (auto-populated after API key validation)
   - Optionally toggle "Include task descriptions"

3. **Fetch Records:**
   - Click "Fetch Records" button
   - The app will retrieve all time entries for the selected period
   - Preview the results in the table

4. **Export to Excel:**
   - Review the fetched records
   - Click "Export to Excel" to download the file
   - File will be named: `Clockify_Export_YYYY-MM-DD_to_YYYY-MM-DD.xlsx`

## File Structure

```
clockify_expoter/
├── index.html          # Main HTML structure
├── styles.css          # Beautiful responsive styles
├── app.js             # Core JavaScript logic and API integration
└── README.md          # This file
```

## API Documentation

The app uses the following Clockify API endpoints:

- `GET /workspaces` - Fetch user's workspaces
- `GET /workspaces/{id}/time-entries` - Fetch time entries for date range

**Note:** Requires valid Clockify API key. Get yours at https://app.clockify.me/user/settings

## Browser Storage

- **API Key:** Saved securely to `api_key.txt` file on the server
  - Persists even after browser cleanup
  - Stored in the project root directory
  - Auto-loads when app starts
  - You can manually delete `api_key.txt` to remove saved key

## Troubleshooting

### "Invalid API key or network error"
- Verify your API key is correct from [Clockify Settings](https://app.clockify.me/user/settings)
- Ensure you're connected to the internet
- Check browser console for detailed error messages (F12)

### "No time entries found"
- Verify you have time entries recorded for the selected date range
- Try expanding the date range
- Check that you're in the correct workspace

### Excel file not downloading
- Check browser's download settings
- Try a different browser
- Ensure you have fetched records first

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **Node.js & Express** - Backend server for file management
- **XLSX Library** - Excel file generation
- **Clockify API** - Time entry data source
- **File System** - Persistent local storage

## Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE 11 (not recommended - use modern browser)

## Security Notes

- 🔒 All processing happens client-side
- 🔒 API key is only stored in your browser's localStorage
- 🔒 No data is sent to external servers except Clockify API
- 🔒 You can review the source code anytime

## Data Privacy

- This app does not collect or store any of your data
- Time entries are only processed to export to Excel
- No tracking, analytics, or telemetry
- Your API key is your responsibility to protect

## Limitations

- Maximum 10,000 time entries per request (Clockify API limit)
- Requires valid Clockify API key
- Browser must have LocalStorage enabled
- Excel export requires JavaScript enabled

## Future Enhancements

- [ ] Dark mode theme toggle
- [ ] Multiple date range export in single file
- [ ] Project filtering and grouping
- [ ] CSV export format
- [ ] Custom column selection
- [ ] Data visualization charts
- [ ] Time entry editing
- [ ] Recurring time entry templates

## License

MIT License - Feel free to use, modify, and distribute

## Support

For issues or feature requests, please check the troubleshooting section or contact support.

---

Made with ❤️ for efficient time tracking  
Clockify Exporter © 2025
# ClockifyExporter
