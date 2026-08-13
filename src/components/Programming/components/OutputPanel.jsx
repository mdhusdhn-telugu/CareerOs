import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const OutputPanel = ({ result, isRunning }) => {
  if (isRunning) return <div style={{color:'#94a3b8'}}>Running Tests...</div>;
  if (!result) return <div style={{color:'#64748b'}}>Output Area</div>;

  return (
    <div>
       <div className={result.status === 'Passed' ? 'status-passed' : 'status-failed'}>
         {result.status === 'Passed' ? <CheckCircle2 size={18}/> : <XCircle size={18}/>}
         {result.status}
       </div>
       
       {result.output && (
         <div className="console-output">
            {result.output}
         </div>
       )}

       {result.failedCase && (
         <div style={{background:'rgba(244, 63, 94, 0.1)', border:'1px solid rgba(244, 63, 94, 0.3)', padding:10, borderRadius:6, marginTop:10}}>
           <div style={{color:'#f43f5e', fontWeight:'bold', fontSize:'0.8rem'}}>Failed Case:</div>
           <div style={{fontFamily:'monospace', fontSize:'0.85rem', marginTop:5}}>
             <div>Expected: {result.failedCase.expected}</div>
             <div>Actual: {result.failedCase.actual}</div>
           </div>
         </div>
       )}
    </div>
  );
};