# Summarization Assistant - Workflow Diagram

## Application Flow

```mermaid
flowchart TD
    Start([User Opens App]) --> Input[Enter URL or Text]
    
    Input --> Params[Select Audience + Purpose]
    
    Params --> Submit[Click Submit]
    
    Submit --> API[Google Gemini API]
    API --> Process{Content Type}
    
    Process -->|URL| URLTool[Use url_context tool<br/>to fetch content]
    Process -->|Text| Direct[Analyze directly]
    
    URLTool --> Generate
    Direct --> Generate[Generate Summary<br/>with context]
    
    Generate --> Response{Valid?}
    
    Response -->|Yes| Display[Display Summary]
    Response -->|No| Error[Show Error]
    
    Display --> Summary[📊 Title + Insights + Steps]
    
    Summary --> Actions[Copy / Download / New]
    
    Actions --> Done([Complete])
    Error --> Input
    
    style Start fill:#475569,stroke:#1e293b,stroke-width:2px,color:#fff
    style Done fill:#475569,stroke:#1e293b,stroke-width:2px,color:#fff
    style API fill:#64748b,stroke:#475569,stroke-width:2px,color:#fff
    style Generate fill:#64748b,stroke:#475569,stroke-width:2px,color:#fff
    style Summary fill:#f1f5f9,stroke:#64748b,stroke-width:2px
    style Error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
```

## Technology Stack

```mermaid
graph LR
    A[React 18 + TypeScript] --> B[Vite Dev Server]
    B --> C[Google Gemini API]
    C --> D[@google/genai SDK]
    
    A --> E[Component Structure]
    E --> F[App.tsx - Main Container]
    E --> G[InputForm.tsx - User Input]
    E --> H[SummaryDisplay.tsx - Results]
    E --> I[LoadingSpinner.tsx - Loading State]
    
    style A fill:#61dafb,stroke:#20232a,color:#000
    style C fill:#4285f4,stroke:#1a73e8,color:#fff
    style E fill:#f1f5f9,stroke:#64748b
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant InputForm
    participant App
    participant SummarizationService
    participant GeminiAPI
    participant SummaryDisplay

    User->>InputForm: Enter URL/Text + Parameters
    User->>InputForm: Click Submit
    InputForm->>App: onSummarize(content, audience, purpose)
    App->>App: Set loading state
    App->>SummarizationService: summarizeContent()
    
    SummarizationService->>SummarizationService: Build prompt with context
    SummarizationService->>GeminiAPI: generateContent() with tools
    
    alt URL Content
        GeminiAPI->>GeminiAPI: Use url_context tool
        GeminiAPI->>GeminiAPI: Fetch & analyze URL
    else Text Content
        GeminiAPI->>GeminiAPI: Analyze text directly
    end
    
    GeminiAPI->>SummarizationService: Return JSON response
    SummarizationService->>SummarizationService: Parse & validate
    SummarizationService->>App: Return Summary object
    App->>App: Clear loading state
    App->>SummaryDisplay: Render summary data
    SummaryDisplay->>User: Display structured summary
    
    User->>SummaryDisplay: Copy/Download/New Summary
```

## Component Hierarchy

```mermaid
graph TD
    App[App.tsx<br/>State Management] --> InputForm[InputForm.tsx<br/>User Input Interface]
    App --> Loading{Loading?}
    Loading -->|Yes| Spinner[LoadingSpinner.tsx]
    Loading -->|No| Summary[SummaryDisplay.tsx<br/>Results Display]
    
    InputForm --> TextArea[Textarea Component]
    InputForm --> Submit[Submit Button]
    InputForm --> Dropdowns[Dropdown Selects]
    
    Dropdowns --> Type[Input Type<br/>URL/Text]
    Dropdowns --> Aud[Audience<br/>5 options]
    Dropdowns --> Pur[Purpose<br/>5 options]
    
    Summary --> Header[Summary Header<br/>+ Action Buttons]
    Summary --> Content[Summary Content]
    
    Content --> TitleSection[Title Section]
    Content --> InsightsSection[Key Insights<br/>Bullet List]
    Content --> StepsSection[Next Steps<br/>Numbered List]
    
    Header --> CopyBtn[Copy Button]
    Header --> DownloadBtn[Download Button]
    
    style App fill:#475569,color:#fff,stroke:#1e293b
    style InputForm fill:#64748b,color:#fff,stroke:#475569
    style Summary fill:#64748b,color:#fff,stroke:#475569
```

## Key Features

- **Single Page Application**: No routing, all interactions on one page
- **Real-time Processing**: Direct API calls to Google Gemini
- **Structured Output**: Consistent JSON format for all summaries
- **Responsive Design**: Mobile-friendly with modern UI
- **Export Options**: Copy to clipboard or download as text file
- **Parameter Customization**: 5 audience types × 5 purpose types = 25 combinations
