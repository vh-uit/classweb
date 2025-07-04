import React, { useState, useRef, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  EyeIcon,
  CodeBracketIcon,
  DocumentIcon,
  Square2StackIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';

interface EnhancedMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  height?: number | string;
  placeholder?: string;
}

const markdownHelpers = [
  { label: 'Bold', syntax: '**bold text**', icon: 'B' },
  { label: 'Italic', syntax: '*italic text*', icon: 'I' },
  { label: 'Heading', syntax: '# Heading', icon: 'H' },
  { label: 'Link', syntax: '[link text](url)', icon: '🔗' },
  { label: 'Image', syntax: '![alt text](image-url)', icon: '🖼️' },
  { label: 'Code', syntax: '`code`', icon: '</>' },
  { label: 'Code Block', syntax: '```\ncode block\n```', icon: '{ }' },
  { label: 'Quote', syntax: '> quote', icon: '"' },
  { label: 'List', syntax: '- item 1\n- item 2', icon: '•' },
  { label: 'Table', syntax: '| Header | Header |\n|--------|--------|\n| Cell   | Cell   |', icon: '⋮⋯' },
  { label: 'Math', syntax: '$$\nE = mc^2\n$$', icon: '∑' },
];

const EnhancedMarkdownEditor: React.FC<EnhancedMarkdownEditorProps> = ({
  value,
  onChange,
  error,
  className,
  height = 500,
  placeholder = 'Write your content in markdown...',
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'split'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'write' | 'preview' | 'split');
  }, []);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const insertText = useCallback((text: string) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      const range = {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn,
      };
      
      editorRef.current.executeEdits('insert-text', [{
        range,
        text,
      }]);
      
      editorRef.current.focus();
    }
  }, []);

  const insertMarkdown = useCallback((syntax: string) => {
    insertText(syntax);
  }, [insertText]);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 24,
    padding: { top: 16, bottom: 16 },
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    lineNumbers: 'on' as const,
    folding: true,
    bracketPairColorization: { enabled: true },
    autoIndent: 'full' as const,
    formatOnPaste: true,
    formatOnType: true,
    tabSize: 2,
    insertSpaces: true,
    renderWhitespace: 'boundary' as const,
    rulers: [80, 120],
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
  };

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Focus mode toggle
  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(!isFocusMode);
  }, [isFocusMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F11 for fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Ctrl/Cmd + Shift + F for focus mode
      if (e.key === 'F' && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleFocusMode();
      }
      // Escape to exit modes
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (isFocusMode) {
          setIsFocusMode(false);
        }
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isFullscreen, isFocusMode, toggleFullscreen, toggleFocusMode]);

  // Dynamic height calculation
  const getEditorHeight = () => {
    if (isFullscreen) {
      return 'calc(100vh - 200px)';
    }
    if (isFocusMode) {
      return '70vh';
    }
    return height;
  };

  const containerClasses = cn(
    'transition-all duration-300 ease-in-out',
    isFullscreen && 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 overflow-auto',
    isFocusMode && !isFullscreen && 'relative z-10 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg',
    !isFullscreen && !isFocusMode && 'space-y-4',
    className
  );

  return (
    <div className={containerClasses} ref={containerRef} tabIndex={-1}>
      {/* Enhanced Toolbar for focus/fullscreen modes */}
      {(isFocusMode || isFullscreen) && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Markdown Editor
          </h3>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleFocusMode}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title={`${isFocusMode ? 'Exit' : 'Enter'} Focus Mode (Ctrl+Shift+F)`}
            >
              {isFocusMode ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeSlashIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title={`${isFullscreen ? 'Exit' : 'Enter'} Fullscreen (F11)`}
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="h-4 w-4" />
              ) : (
                <ArrowsPointingOutIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-1">
          {markdownHelpers.map((helper, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs font-mono hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => insertMarkdown(helper.syntax)}
              title={helper.label}
            >
              {helper.icon}
            </Button>
          ))}
        </div>
        
        {/* Focus and Fullscreen Controls */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleFocusMode}
            className="h-8 px-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            title={`${isFocusMode ? 'Exit' : 'Enter'} Focus Mode (Ctrl+Shift+F)`}
          >
            {isFocusMode ? (
              <EyeIcon className="h-4 w-4" />
            ) : (
              <EyeSlashIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 px-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            title={`${isFullscreen ? 'Exit' : 'Enter'} Fullscreen (F11)`}
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="h-4 w-4" />
            ) : (
              <ArrowsPointingOutIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="write" className="flex items-center gap-2">
            <CodeBracketIcon className="w-4 h-4" />
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <EyeIcon className="w-4 h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="split" className="flex items-center gap-2">
            <Square2StackIcon className="w-4 h-4" />
            Split
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <Editor
              height={getEditorHeight()}
              defaultLanguage="markdown"
              value={value}
              onChange={(val) => onChange(val || '')}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={editorOptions}
              loading={
                <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900">
                  <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div 
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900 overflow-auto"
            style={{ height: getEditorHeight() }}
          >
            {value ? (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
                  components={{
                    img: ({ src, alt, ...props }) => (
                      <img
                        src={src}
                        alt={alt}
                        className="rounded-lg shadow-md max-w-full h-auto"
                        {...props}
                      />
                    ),
                    code: ({ className, children, ...props }: any) => {
                      const isInline = !className?.includes('language-');
                      return !isInline ? (
                        <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <DocumentIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nothing to preview</p>
                  <p className="text-sm">Start writing to see the preview</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="split" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Editor Panel */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <CodeBracketIcon className="w-4 h-4" />
                  Editor
                </div>
              </div>
              <Editor
                height={getEditorHeight()}
                defaultLanguage="markdown"
                value={value}
                onChange={(val) => onChange(val || '')}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={editorOptions}
                loading={
                  <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900">
                    <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
                  </div>
                }
              />
            </div>

            {/* Preview Panel */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <EyeIcon className="w-4 h-4" />
                  Preview
                </div>
              </div>
              <div 
                className="p-6 bg-white dark:bg-gray-900 overflow-auto"
                style={{ height: getEditorHeight() }}
              >
                {value ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
                      components={{
                        img: ({ src, alt, ...props }) => (
                          <img
                            src={src}
                            alt={alt}
                            className="rounded-lg shadow-md max-w-full h-auto"
                            {...props}
                          />
                        ),
                        code: ({ className, children, ...props }: any) => {
                          const isInline = !className?.includes('language-');
                          return !isInline ? (
                            <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {value}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <DocumentIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Start writing to see the preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Keyboard shortcuts hint for focus/fullscreen modes */}
      {(isFocusMode || isFullscreen) && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Keyboard Shortcuts:
          </h5>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">F11</kbd> - Toggle Fullscreen</li>
            <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Shift+F</kbd> - Toggle Focus Mode</li>
            <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Escape</kbd> - Exit Current Mode</li>
            <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+B</kbd> - Bold • <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+I</kbd> - Italic</li>
          </ul>
        </div>
      )}

      {error && (
        <div className={cn(
          "flex items-center gap-2 text-red-600 dark:text-red-400 text-sm",
          (isFocusMode || isFullscreen) && "text-base"
        )}>
          <svg className={cn(
            "w-4 h-4",
            (isFocusMode || isFullscreen) && "w-5 h-5"
          )} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default EnhancedMarkdownEditor;
