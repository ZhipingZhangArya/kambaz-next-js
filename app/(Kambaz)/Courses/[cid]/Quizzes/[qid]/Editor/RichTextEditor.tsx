"use client";
import { useState, useRef, useEffect } from "react";
import { Button, Modal, Form, Dropdown } from "react-bootstrap";
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaSuperscript,
  FaPalette,
  FaHighlighter,
  FaTable,
  FaImage
} from "react-icons/fa";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter quiz instructions...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  useEffect(() => {
    const checkToolbarOverflow = () => {
      if (!toolbarRef.current) return;

      const toolbar = toolbarRef.current;
      const toolbarWidth = toolbar.offsetWidth;
      const children = Array.from(toolbar.children) as HTMLElement[];
      
      // Get all toolbar items (excluding the more menu)
      const toolbarItems = children.filter(child => 
        child.id && child.id.startsWith("toolbar-") && child.id !== "more-menu"
      );

      // Show all items first to measure
      toolbarItems.forEach(item => {
        item.style.display = "";
      });

      // Measure each item's width
      const itemWidths: { id: string; width: number }[] = [];
      toolbarItems.forEach((item) => {
        itemWidths.push({ id: item.id, width: item.offsetWidth });
      });

      // Calculate which items fit
      let currentWidth = 0;
      const moreMenuWidth = 60; // Approximate width of more menu button + padding
      const visibleItems: string[] = [];
      const hidden: string[] = [];

      itemWidths.forEach((item) => {
        const wouldFit = currentWidth + item.width <= toolbarWidth - moreMenuWidth;
        if (wouldFit) {
          visibleItems.push(item.id);
          currentWidth += item.width;
        } else {
          hidden.push(item.id);
        }
      });

      // If all items fit, don't show more menu
      if (hidden.length === 0) {
        setHiddenItems([]);
        setShowMoreMenu(false);
        // Make sure all items are visible
        toolbarItems.forEach(item => {
          item.style.display = "";
        });
      } else {
        setHiddenItems(hidden);
        setShowMoreMenu(true);
        // Hide items that don't fit
        toolbarItems.forEach(item => {
          if (hidden.includes(item.id)) {
            item.style.display = "none";
          } else {
            item.style.display = "";
          }
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(checkToolbarOverflow, 100);
    window.addEventListener("resize", checkToolbarOverflow);
    
    // Use ResizeObserver for more accurate detection
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkToolbarOverflow, 50);
    });
    if (toolbarRef.current) {
      resizeObserver.observe(toolbarRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkToolbarOverflow);
      resizeObserver.disconnect();
    };
  }, []);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  };

  const countWords = (html: string): number => {
    // Create a temporary div to extract text content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    // Remove extra whitespace and split by whitespace
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const wordCount = countWords(value);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current && editorRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRef.current);
        editorRef.current.focus();
      }
    } else if (editorRef.current) {
      // If no saved selection, place cursor at end of content
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        editorRef.current.focus();
      }
    }
  };

  const insertTable = () => {
    restoreSelection();
    
    let tableHTML = "<table style='border-collapse: collapse; width: 100%; margin: 10px 0;'>";
    for (let i = 0; i < tableRows; i++) {
      tableHTML += "<tr>";
      for (let j = 0; j < tableCols; j++) {
        tableHTML += "<td style='border: 1px solid #ccc; padding: 8px;'>&nbsp;</td>";
      }
      tableHTML += "</tr>";
    }
    tableHTML += "</table>";
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = tableHTML;
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      range.insertNode(fragment);
      handleInput();
    } else {
      // Fallback: insert at end if no selection
      if (editorRef.current) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = tableHTML;
        editorRef.current.appendChild(tempDiv.firstChild!);
        handleInput();
      }
    }
    setShowTableModal(false);
    setTableRows(3);
    setTableCols(3);
    savedSelectionRef.current = null;
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImage = () => {
    if (!imageFile) {
      alert("Please select an image file");
      return;
    }
    
    restoreSelection();
    
    // Use the preview (base64 data URL) as the image source
    const imgHTML = `<img src="${imagePreview}" alt="Image" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = imgHTML;
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      range.insertNode(fragment);
      handleInput();
    } else {
      // Fallback: insert at end if no selection
      if (editorRef.current) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = imgHTML;
        editorRef.current.appendChild(tempDiv.firstChild!);
        handleInput();
      }
    }
    setShowImageModal(false);
    setImageFile(null);
    setImagePreview("");
    savedSelectionRef.current = null;
  };

  const colors = [
    "#000000", "#333333", "#666666", "#999999", "#CCCCCC",
    "#FF0000", "#FF6600", "#FFCC00", "#00FF00", "#0066FF",
    "#0000FF", "#6600FF", "#FF00FF", "#FFFFFF"
  ];

  return (
    <div className="rich-text-editor-wrapper" style={{ border: "1px solid #ccc", borderRadius: "4px" }}>
      {/* Toolbar */}
      <div 
        className="d-flex align-items-center p-2 border-bottom"
        style={{ 
          backgroundColor: "#f8f9fa",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px"
        }}
      >
        {/* Font Size */}
        <select
          id="toolbar-font-size"
          className="form-select form-select-sm me-2"
          style={{ 
            width: "auto", 
            fontSize: "12px",
            display: hiddenItems.includes("toolbar-font-size") ? "none" : "block"
          }}
          onChange={(e) => execCommand("fontSize", e.target.value)}
        >
          <option value="3">12pt</option>
          <option value="4">14pt</option>
          <option value="5">16pt</option>
          <option value="6">18pt</option>
          <option value="7">20pt</option>
        </select>

        {/* Paragraph Style */}
        <select
          id="toolbar-paragraph"
          className="form-select form-select-sm me-2"
          style={{ 
            width: "auto", 
            fontSize: "12px",
            display: hiddenItems.includes("toolbar-paragraph") ? "none" : "block"
          }}
          onChange={(e) => {
            if (e.target.value === "p") {
              execCommand("formatBlock", "<p>");
            } else {
              execCommand("formatBlock", `<${e.target.value}>`);
            }
          }}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div 
          id="toolbar-separator-1"
          className="vr me-2" 
          style={{ 
            height: "20px",
            display: hiddenItems.includes("toolbar-separator-1") ? "none" : "block"
          }}
        ></div>

        {/* Bold */}
        <Button
          id="toolbar-bold"
          variant="link"
          size="sm"
          className="p-1 me-1"
          onClick={() => execCommand("bold")}
          style={{ 
            minWidth: "30px",
            display: hiddenItems.includes("toolbar-bold") ? "none" : "flex",
            color: "#333"
          }}
        >
          <FaBold />
        </Button>

        {/* Italic */}
        <Button
          id="toolbar-italic"
          variant="link"
          size="sm"
          className="p-1 me-1"
          onClick={() => execCommand("italic")}
          style={{ 
            minWidth: "30px",
            display: hiddenItems.includes("toolbar-italic") ? "none" : "flex",
            color: "#333"
          }}
        >
          <FaItalic />
        </Button>

        {/* Underline */}
        <Button
          id="toolbar-underline"
          variant="link"
          size="sm"
          className="p-1 me-1"
          onClick={() => execCommand("underline")}
          style={{ 
            minWidth: "30px",
            display: hiddenItems.includes("toolbar-underline") ? "none" : "flex",
            color: "#333"
          }}
        >
          <FaUnderline />
        </Button>

        {/* Text Color */}
        <div 
          id="toolbar-color"
          className="position-relative me-1"
          style={{ display: hiddenItems.includes("toolbar-color") ? "none" : "block" }}
        >
          <Button
            variant="link"
            size="sm"
            className="p-1"
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{ minWidth: "30px", color: "#333" }}
          >
            <FaPalette />
          </Button>
          {showColorPicker && (
            <div
              className="position-absolute bg-white border shadow-sm p-2"
              style={{
                top: "100%",
                left: 0,
                zIndex: 1000,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "4px",
                width: "200px"
              }}
            >
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="btn btn-sm"
                  style={{
                    backgroundColor: color,
                    border: "1px solid #ccc",
                    width: "24px",
                    height: "24px",
                    padding: 0
                  }}
                  onClick={() => {
                    execCommand("foreColor", color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight Color */}
        <div 
          id="toolbar-highlight"
          className="position-relative me-1"
          style={{ display: hiddenItems.includes("toolbar-highlight") ? "none" : "block" }}
        >
          <Button
            variant="link"
            size="sm"
            className="p-1"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            style={{ minWidth: "30px", color: "#333" }}
          >
            <FaHighlighter />
          </Button>
          {showHighlightPicker && (
            <div
              className="position-absolute bg-white border shadow-sm p-2"
              style={{
                top: "100%",
                left: 0,
                zIndex: 1000,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "4px",
                width: "200px"
              }}
            >
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="btn btn-sm"
                  style={{
                    backgroundColor: color,
                    border: "1px solid #ccc",
                    width: "24px",
                    height: "24px",
                    padding: 0
                  }}
                  onClick={() => {
                    execCommand("backColor", color);
                    setShowHighlightPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Superscript */}
        <Button
          id="toolbar-superscript"
          variant="link"
          size="sm"
          className="p-1 me-1"
          onClick={() => execCommand("superscript")}
          style={{ 
            minWidth: "30px",
            display: hiddenItems.includes("toolbar-superscript") ? "none" : "flex",
            color: "#333"
          }}
        >
          T²
        </Button>

        <div 
          id="toolbar-separator-2"
          className="vr me-2" 
          style={{ 
            height: "20px",
            display: hiddenItems.includes("toolbar-separator-2") ? "none" : "block"
          }}
        ></div>

        {/* Insert Table */}
        <Button
          id="toolbar-table"
          variant="link"
          size="sm"
          className="p-1 me-1"
          onClick={() => {
            saveSelection();
            setShowTableModal(true);
          }}
          style={{ 
            minWidth: "30px",
            display: hiddenItems.includes("toolbar-table") ? "none" : "flex",
            color: "#333"
          }}
          title="Insert Table"
        >
          <FaTable />
        </Button>

        {/* Insert Image */}
        <Button
          id="toolbar-image"
          variant="link"
          size="sm"
          className="p-1 me-1"
          onClick={() => {
            saveSelection();
            setShowImageModal(true);
          }}
          style={{ 
            minWidth: "30px",
            display: hiddenItems.includes("toolbar-image") ? "none" : "flex",
            color: "#333"
          }}
          title="Insert Image"
        >
          <FaImage />
        </Button>

        {/* More Options Menu */}
        {showMoreMenu && (
          <div id="more-menu" className="ms-auto">
            <Dropdown show={showMoreDropdown} onToggle={setShowMoreDropdown}>
              <Dropdown.Toggle
                variant="link"
                size="sm"
                className="p-1"
                style={{ minWidth: "30px", color: "#333" }}
              >
                ⋮
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {hiddenItems.includes("toolbar-font-size") && (
                  <Dropdown.Item as="div" className="px-3 py-2">
                    <label className="mb-0">
                      Font Size:
                      <select
                        className="form-select form-select-sm ms-2"
                        style={{ width: "auto", display: "inline-block" }}
                        onChange={(e) => execCommand("fontSize", e.target.value)}
                      >
                        <option value="3">12pt</option>
                        <option value="4">14pt</option>
                        <option value="5">16pt</option>
                        <option value="6">18pt</option>
                        <option value="7">20pt</option>
                      </select>
                    </label>
                  </Dropdown.Item>
                )}
                {hiddenItems.includes("toolbar-paragraph") && (
                  <Dropdown.Item as="div" className="px-3 py-2">
                    <label className="mb-0">
                      Style:
                      <select
                        className="form-select form-select-sm ms-2"
                        style={{ width: "auto", display: "inline-block" }}
                        onChange={(e) => {
                          if (e.target.value === "p") {
                            execCommand("formatBlock", "<p>");
                          } else {
                            execCommand("formatBlock", `<${e.target.value}>`);
                          }
                        }}
                      >
                        <option value="p">Paragraph</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                      </select>
                    </label>
                  </Dropdown.Item>
                )}
                {hiddenItems.includes("toolbar-bold") && (
                  <Dropdown.Item onClick={() => execCommand("bold")}>
                    <FaBold className="me-2" /> Bold
                  </Dropdown.Item>
                )}
                {hiddenItems.includes("toolbar-italic") && (
                  <Dropdown.Item onClick={() => execCommand("italic")}>
                    <FaItalic className="me-2" /> Italic
                  </Dropdown.Item>
                )}
                {hiddenItems.includes("toolbar-underline") && (
                  <Dropdown.Item onClick={() => execCommand("underline")}>
                    <FaUnderline className="me-2" /> Underline
                  </Dropdown.Item>
                )}
                {hiddenItems.includes("toolbar-color") && (
                  <Dropdown.Item
                    onClick={() => {
                      setShowColorPicker(!showColorPicker);
                      setShowMoreDropdown(false);
                    }}
                  >
                    <FaPalette className="me-2" /> Text Color
                  </Dropdown.Item>
                )}
                {hiddenItems.includes("toolbar-highlight") && (
                  <Dropdown.Item
                    onClick={() => {
                      setShowHighlightPicker(!showHighlightPicker);
                      setShowMoreDropdown(false);
                    }}
                  >
                    <FaHighlighter className="me-2" /> Highlight
                  </Dropdown.Item>
                )}
                {hiddenItems.includes("toolbar-superscript") && (
                  <Dropdown.Item onClick={() => execCommand("superscript")}>
                    T² Superscript
                  </Dropdown.Item>
                )}
                {hiddenItems.includes("toolbar-table") && (
                  <Dropdown.Item
                    onClick={() => {
                      saveSelection();
                      setShowTableModal(true);
                      setShowMoreDropdown(false);
                    }}
                  >
                    <FaTable className="me-2" /> Insert Table
                  </Dropdown.Item>
                )}
                {hiddenItems.includes("toolbar-image") && (
                  <Dropdown.Item
                    onClick={() => {
                      saveSelection();
                      setShowImageModal(true);
                      setShowMoreDropdown(false);
                    }}
                  >
                    <FaImage className="me-2" /> Insert Image
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </div>

      {/* Table Insertion Modal */}
      <Modal show={showTableModal} onHide={() => setShowTableModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Insert Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Rows:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="20"
              value={tableRows}
              onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Columns:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="20"
              value={tableCols}
              onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTableModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={insertTable}>
            Insert
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Insertion Modal */}
      <Modal show={showImageModal} onHide={() => {
        setShowImageModal(false);
        setImageFile(null);
        setImagePreview("");
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Insert Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Upload Image:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
            />
            <Form.Text className="text-muted">
              Select an image file from your computer
            </Form.Text>
          </Form.Group>
          {imagePreview && (
            <div className="mb-3">
              <Form.Label>Preview:</Form.Label>
              <div className="border p-2" style={{ maxWidth: "100%", textAlign: "center" }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: "100%", maxHeight: "300px" }}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowImageModal(false);
              setImageFile(null);
              setImagePreview("");
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={insertImage}
            disabled={!imageFile}
          >
            Insert
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="p-3"
        style={{
          minHeight: "150px",
          fontSize: "16px",
          outline: "none",
          color: value ? "inherit" : "#999"
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Word Count Footer */}
      <div 
        className="d-flex justify-content-end align-items-center px-3 py-2 border-top"
        style={{ 
          backgroundColor: "#f8f9fa",
          fontSize: "12px",
          color: "#666"
        }}
      >
        <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
      </div>

      <style jsx global>{`
        .rich-text-editor-wrapper [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #999;
          font-style: italic;
        }
        .rich-text-editor-wrapper [contenteditable]:focus {
          outline: none;
        }
        .rich-text-editor-wrapper .btn-link {
          color: #333 !important;
        }
        .rich-text-editor-wrapper .btn-link:hover {
          color: #000 !important;
        }
        .rich-text-editor-wrapper .btn-link:focus {
          color: #333 !important;
        }
      `}</style>
    </div>
  );
}
