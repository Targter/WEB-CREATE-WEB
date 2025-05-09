import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { FileNode, WebContainer } from '@webcontainer/api';
import { Loader } from '../components/Loader';

// const MOCK_

export function Builder() {
  console.log("PAGE CALLED..........")
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    console.log("responseAfterChange:",steps)
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log("MOUNTsTRCUTURE:",mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    if(!prompt) return; 
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });


    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
  
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })
    console.log("responseChat:",stepsResponse)
    setLoading(false);
    
    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  useEffect(() => {
    console.log("called")
    init();
  }, [])

//   background-color: #003366;
// background-image: linear-gradient(315deg, #003366 0%, #242124 74%);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col" style={{
      backgroundColor: "#003366",
      backgroundImage: "linear-gradient(315deg, #003366 0%, #242124 74%)"
    }}
>    
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex" style={{     backgroundColor: "#003153",
      backgroundImage: "linear-gradient(315deg, #003153 0%, #1B1B1B 74%)"}}>
        <h1 className="text-xl font-semibold text-gray-100">AB-WEB-APP</h1>
        <p className="text-sm text-gray-400 mt-1 w-[80%] text-center ">Prompt: {prompt}</p>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1  space-y-6 overflow-auto">
            <div>
              <div className="max-h-[550px]  hide-scrollbar overflow-y-auto" 
                style={{
                  scrollbarWidth: 'thin', // Firefox
                  scrollbarColor: "rgb(17, 24, 39)",/* Firefox fallback */
              
              }}>
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              <div>
                <div className='flex h-[150px] mt-7 border-3 rounded-sm'>
                  <br />
                  {/* {(loading || !templateSet) && <Loader />} */}
                  {!(loading || !templateSet) || <div className='flex'>
                    <textarea value={userPrompt} onChange={(e) => {
                    setPrompt(e.target.value)
                  }} className='p-2 w-[300px] bg-white'></textarea>
                  <button onClick={async () => {
                    const newMessage = {
                      role: "user" as "user",
                      content: userPrompt
                    };

                    // setLoading(true);
                    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                      messages: [...llmMessages, newMessage]
                    });
                    setLoading(false);

                    setLlmMessages(x => [...x, newMessage]);
                    setLlmMessages(x => [...x, {
                      role: "assistant",
                      content: stepsResponse.data.response
                    }]);
                    
                    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                      ...x,
                      status: "pending" as "pending"
                    }))]);

                  }} className='bg-gray-800 px-4 w-[80px] text-center'>Send</button>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        
          <div className="col-span-3 bg-[#161717] rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)] flex"style={{
      backgroundColor: "#003366",
      backgroundImage: "linear-gradient(315deg, #003366 0%, #242124 74%)"
    }}>
          <div className="w-[200px] mr-11">
            {!files && <div>Loading</div>}
              <FileExplorer 
                files={files} 
                onFileSelect={setSelectedFile}
                onTabChange={setActiveTab}
              />
            </div >
            {/*  */}
           <div className='w-full'>
             <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)] flex w-full  ">
         
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile}  />
              ) : (
                <PreviewFrame webContainer={webcontainer as WebContainer} files={files} />
              )}
            </div></div>
          </div>
        </div>
      </div>
    </div>
  );
}