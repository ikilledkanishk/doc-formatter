import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Upload, Save, Users, Settings, Eye, Plus, Trash2, Edit3 } from 'lucide-react';

const DocumentFormatter = () => {
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('resume');
  const [documents, setDocuments] = useState([]);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('edit');
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [collaborators, setCollaborators] = useState([]);
  const [showCustomTemplateModal, setShowCustomTemplateModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const fileInputRef = useRef(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    fontFamily: 'Arial',
    fontSize: '12',
    lineHeight: '1.5',
    alignment: 'left',
    headerFooter: true,
    sections: []
  });

  // Pre-defined templates
  const templates = {
    resume: {
      name: 'Professional Resume',
      fontFamily: 'Arial, sans-serif',
      fontSize: '11pt',
      lineHeight: '1.4',
      alignment: 'left',
      headerFooter: true,
      sections: ['Header', 'Summary', 'Experience', 'Education', 'Skills']
    },
    businessLetter: {
      name: 'Business Letter',
      fontFamily: 'Times New Roman, serif',
      fontSize: '12pt',
      lineHeight: '1.6',
      alignment: 'left',
      headerFooter: true,
      sections: ['Sender Address', 'Date', 'Recipient Address', 'Salutation', 'Body', 'Closing']
    },
    projectReport: {
      name: 'Project Report',
      fontFamily: 'Georgia, serif',
      fontSize: '12pt',
      lineHeight: '1.8',
      alignment: 'justify',
      headerFooter: true,
      sections: ['Title Page', 'Abstract', 'Introduction', 'Methodology', 'Results', 'Conclusion']
    }
  };

  // Load saved documents on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    setDocuments(saved);
    const customTemps = JSON.parse(localStorage.getItem('customTemplates') || '[]');
    setCustomTemplates(customTemps);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (content && currentDocId) {
      const timer = setTimeout(() => {
        saveDocument(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, documentTitle, selectedTemplate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const saveDocument = (autoSave = false) => {
    const doc = {
      id: currentDocId || Date.now(),
      title: documentTitle,
      content: content,
      template: selectedTemplate,
      lastModified: new Date().toISOString(),
      collaborators: collaborators
    };

    const existingDocs = documents.filter(d => d.id !== doc.id);
    const updatedDocs = [...existingDocs, doc];
    setDocuments(updatedDocs);
    localStorage.setItem('savedDocuments', JSON.stringify(updatedDocs));
    
    if (!currentDocId) {
      setCurrentDocId(doc.id);
    }
    
    if (!autoSave) {
      setShowSaveModal(false);
      alert('Document saved successfully!');
    }
  };

  const loadDocument = (doc) => {
    setContent(doc.content);
    setDocumentTitle(doc.title);
    setSelectedTemplate(doc.template);
    setCurrentDocId(doc.id);
    setCollaborators(doc.collaborators || []);
    setActiveTab('edit');
  };

  const deleteDocument = (id) => {
    const updatedDocs = documents.filter(d => d.id !== id);
    setDocuments(updatedDocs);
    localStorage.setItem('savedDocuments', JSON.stringify(updatedDocs));
  };

  const createNewDocument = () => {
    setContent('');
    setDocumentTitle('Untitled Document');
    setCurrentDocId(null);
    setCollaborators([]);
    setActiveTab('edit');
  };

  const saveCustomTemplate = () => {
    const template = {
      id: Date.now(),
      ...newTemplate
    };
    const updated = [...customTemplates, template];
    setCustomTemplates(updated);
    localStorage.setItem('customTemplates', JSON.stringify(updated));
    setShowCustomTemplateModal(false);
    setNewTemplate({
      name: '',
      fontFamily: 'Arial',
      fontSize: '12',
      lineHeight: '1.5',
      alignment: 'left',
      headerFooter: true,
      sections: []
    });
    alert('Custom template saved!');
  };

  const addCollaborator = () => {
    const email = prompt('Enter collaborator email:');
    if (email) {
      setCollaborators([...collaborators, { email, added: new Date().toISOString() }]);
    }
  };

  const exportToPDF = () => {
    const template = templates[selectedTemplate] || customTemplates.find(t => t.id === selectedTemplate);
    const printWindow = window.open('', '', 'width=800,height=600');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            @page { margin: 1in; }
            body {
              font-family: ${template.fontFamily};
              font-size: ${template.fontSize};
              line-height: ${template.lineHeight};
              text-align: ${template.alignment};
              margin: 0;
              padding: 20px;
            }
            h1 { font-size: 18pt; margin-bottom: 10px; }
            h2 { font-size: 14pt; margin-top: 15px; margin-bottom: 8px; }
            p { margin-bottom: 10px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .footer { border-top: 1px solid #333; padding-top: 10px; margin-top: 20px; text-align: center; font-size: 10pt; }
          </style>
        </head>
        <body>
          ${template.headerFooter ? `<div class="header"><h1>${documentTitle}</h1></div>` : ''}
          ${content.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('')}
          ${template.headerFooter ? `<div class="footer">Page 1 - ${new Date().toLocaleDateString()}</div>` : ''}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const exportToDOC = () => {
    const template = templates[selectedTemplate] || customTemplates.find(t => t.id === selectedTemplate);
    
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${documentTitle}</title>
          <style>
            body {
              font-family: ${template.fontFamily};
              font-size: ${template.fontSize};
              line-height: ${template.lineHeight};
              text-align: ${template.alignment};
            }
            h1 { font-size: 18pt; }
            h2 { font-size: 14pt; }
          </style>
        </head>
        <body>
          ${template.headerFooter ? `<h1>${documentTitle}</h1><hr>` : ''}
          ${content.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('')}
          ${template.headerFooter ? `<hr><p style="text-align:center;">${new Date().toLocaleDateString()}</p>` : ''}
        </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', docContent], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentTitle}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCurrentTemplate = () => {
    return templates[selectedTemplate] || customTemplates.find(t => t.id === selectedTemplate);
  };

  const renderPreview = () => {
    const template = getCurrentTemplate();
    if (!template) return null;

    return (
      <div 
        className="bg-white p-8 shadow-lg mx-auto"
        style={{
          fontFamily: template.fontFamily,
          fontSize: template.fontSize,
          lineHeight: template.lineHeight,
          textAlign: template.alignment,
          maxWidth: '8.5in',
          minHeight: '11in'
        }}
      >
        {template.headerFooter && (
          <div className="border-b-2 border-gray-800 pb-3 mb-6">
            <h1 className="text-2xl font-bold">{documentTitle}</h1>
          </div>
        )}
        <div className="whitespace-pre-wrap">
          {content || 'Start typing or paste your content...'}
        </div>
        {template.headerFooter && (
          <div className="border-t border-gray-800 pt-3 mt-6 text-center text-sm text-gray-600">
            Page 1 - {new Date().toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">Document Formatter Pro</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={createNewDocument}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {['edit', 'preview', 'documents', 'templates', 'collaborate'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab === 'edit' && <Edit3 className="w-4 h-4 inline mr-2" />}
                {tab === 'preview' && <Eye className="w-4 h-4 inline mr-2" />}
                {tab === 'documents' && <FileText className="w-4 h-4 inline mr-2" />}
                {tab === 'templates' && <Settings className="w-4 h-4 inline mr-2" />}
                {tab === 'collaborate' && <Users className="w-4 h-4 inline mr-2" />}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Edit Tab */}
        {activeTab === 'edit' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-4 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Document Content
                    </label>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center space-x-1 text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload File</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste or type your content here..."
                    className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Select Template</h3>
                <div className="space-y-2">
                  {Object.entries(templates).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      className={`w-full p-3 text-left rounded-lg border-2 transition ${
                        selectedTemplate === key
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {template.fontFamily.split(',')[0]} • {template.fontSize}
                      </div>
                    </button>
                  ))}
                  
                  {customTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full p-3 text-left rounded-lg border-2 transition ${
                        selectedTemplate === template.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">Custom Template</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                <div className="space-y-2">
                  <button
                    onClick={exportToPDF}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export as PDF</span>
                  </button>
                  <button
                    onClick={exportToDOC}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export as DOC</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-gray-100 p-8 rounded-lg">
            {renderPreview()}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Saved Documents</h2>
            {documents.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No saved documents yet</p>
            ) : (
              <div className="grid gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{doc.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Last modified: {new Date(doc.lastModified).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Template: {templates[doc.template]?.name || 'Custom'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadDocument(doc)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Custom Templates</h2>
              <button
                onClick={() => setShowCustomTemplateModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {customTemplates.map(template => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Font: {template.fontFamily}</p>
                    <p>Size: {template.fontSize}pt</p>
                    <p>Line Height: {template.lineHeight}</p>
                    <p>Alignment: {template.alignment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaborate Tab */}
        {activeTab === 'collaborate' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Collaborators</h2>
              <button
                onClick={addCollaborator}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Collaborator</span>
              </button>
            </div>

            {collaborators.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No collaborators yet</p>
                <p className="text-sm text-gray-400 mt-2">Add team members to collaborate on this document</p>
              </div>
            ) : (
              <div className="space-y-3">
                {collaborators.map((collab, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {collab.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{collab.email}</p>
                        <p className="text-xs text-gray-500">Added {new Date(collab.added).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCollaborators(collaborators.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a client-side demo. In a production environment, collaboration would be powered by WebSocket connections for real-time editing with conflict resolution and version control.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Template Modal */}
      {showCustomTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create Custom Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Template Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="My Custom Template"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Font Family</label>
                <select
                  value={newTemplate.fontFamily}
                  onChange={(e) => setNewTemplate({...newTemplate, fontFamily: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Font Size (pt)</label>
                <input
                  type="number"
                  value={newTemplate.fontSize}
                  onChange={(e) => setNewTemplate({...newTemplate, fontSize: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="8"
                  max="24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Line Height</label>
                <input
                  type="number"
                  step="0.1"
                  value={newTemplate.lineHeight}
                  onChange={(e) => setNewTemplate({...newTemplate, lineHeight: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                  max="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Text Alignment</label>
                <select
                  value={newTemplate.alignment}
                  onChange={(e) => setNewTemplate({...newTemplate, alignment: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newTemplate.headerFooter}
                  onChange={(e) => setNewTemplate({...newTemplate, headerFooter: e.target.checked})}
                  className="w-4 h-4 text-indigo-600"
                />
                <label className="ml-2 text-sm">Include Header/Footer</label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveCustomTemplate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Template
              </button>
              <button
                onClick={() => setShowCustomTemplateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Save Document</h3>
            <p className="text-gray-600 mb-4">
              {currentDocId ? 'Update existing document?' : 'Save this document for later?'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => saveDocument(false)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentFormatter;