import React, { useState } from 'react';
import { FolderTree, File, ChevronRight, ChevronDown } from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  onTabChange: (tab: 'code' | 'preview') => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
  onTabChange: (tab: 'code' | 'preview') => void;
}

function FileNode({ item, depth, onFileClick ,onTabChange}: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    console.log("call this")
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
    onTabChange('code')
    
    
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md cursor-pointer"
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="text-gray-400">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        {item.type === 'folder' ? (
          <FolderTree className="w-4 h-4 text-blue-400" />
        ) : (
          <File className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-gray-200">{item.name}</span>
      </div>
      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              onTabChange={onTabChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

    
export function FileExplorer({ files, onFileSelect ,onTabChange}: FileExplorerProps) {
  return (
    <div className=" rounded-lg  p-4 h-full overflow-auto ">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
        <FolderTree className="w-5 h-5" />
        File Explorer
      </h2>
      <div className="space-y-1">
        {files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onTabChange={onTabChange}
            onFileClick={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}