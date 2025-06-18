import { DocumentNode } from "./ScrivenerTypes";

export class ScrivenerUtils {
  static findDocument(nodes: DocumentNode[], id: string): DocumentNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findDocument(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  static toggleDocumentExpansion(
    documents: DocumentNode[], 
    targetId: string
  ): DocumentNode[] {
    return documents.map(doc => {
      if (doc.id === targetId) {
        return { ...doc, expanded: !doc.expanded };
      }
      if (doc.children) {
        return {
          ...doc,
          children: this.toggleDocumentExpansion(doc.children, targetId)
        };
      }
      return doc;
    });
  }

  static updateDocumentContent(
    documents: DocumentNode[], 
    targetId: string, 
    content: string
  ): DocumentNode[] {
    return documents.map(doc => {
      if (doc.id === targetId) {
        const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
        return { ...doc, content, wordCount, modified: new Date() };
      }
      if (doc.children) {
        return {
          ...doc,
          children: this.updateDocumentContent(doc.children, targetId, content)
        };
      }
      return doc;
    });
  }

  static calculateTotalWordCount(documents: DocumentNode[]): number {
    return documents.reduce((total, doc) => {
      let count = doc.wordCount || 0;
      if (doc.children) {
        count += this.calculateTotalWordCount(doc.children);
      }
      return total + count;
    }, 0);
  }

  static filterDocuments(
    documents: DocumentNode[], 
    searchQuery: string
  ): DocumentNode[] {
    if (!searchQuery.trim()) return documents;
    
    const query = searchQuery.toLowerCase();
    
    const filterNode = (node: DocumentNode): DocumentNode | null => {
      const matchesTitle = node.title.toLowerCase().includes(query);
      const matchesContent = node.content?.toLowerCase().includes(query) || false;
      
      let filteredChildren: DocumentNode[] = [];
      if (node.children) {
        filteredChildren = node.children
          .map(child => filterNode(child))
          .filter((child): child is DocumentNode => child !== null);
      }
      
      if (matchesTitle || matchesContent || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
          expanded: filteredChildren.length > 0 ? true : node.expanded
        };
      }
      
      return null;
    };
    
    return documents
      .map(doc => filterNode(doc))
      .filter((doc): doc is DocumentNode => doc !== null);
  }

  static getDocumentPath(documents: DocumentNode[], targetId: string): string[] {
    const findPath = (nodes: DocumentNode[], path: string[] = []): string[] | null => {
      for (const node of nodes) {
        const currentPath = [...path, node.title];
        if (node.id === targetId) {
          return currentPath;
        }
        if (node.children) {
          const found = findPath(node.children, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findPath(documents) || [];
  }

  static exportDocument(document: DocumentNode): string {
    let content = `# ${document.title}\n\n`;
    
    if (document.content) {
      content += document.content + '\n\n';
    }
    
    if (document.children) {
      for (const child of document.children) {
        content += this.exportDocument(child);
      }
    }
    
    return content;
  }

  static getDocumentStats(document: DocumentNode): {
    totalWords: number;
    totalCharacters: number;
    totalParagraphs: number;
    estimatedReadingTime: number;
  } {
    const content = document.content || '';
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    return {
      totalWords: words.length,
      totalCharacters: content.length,
      totalParagraphs: paragraphs.length,
      estimatedReadingTime: Math.ceil(words.length / 200) // Assuming 200 words per minute
    };
  }
}