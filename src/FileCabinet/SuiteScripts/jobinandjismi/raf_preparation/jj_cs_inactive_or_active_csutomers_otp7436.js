/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/url'],
/**
 * @param{currentRecord} currentRecord
 * @param{url} url
 */
function(currentRecord, url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
        window.onbeforeunload =null


    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        
        window.setTimeout(getValues(),30000)
        setTimeout(sublistChanged,50000)
        
        
    }
    
    function getValues(){
        let currecRecord = currentRecord.get();
        let sdate  = currecRecord.getText({
            fieldId: "custpage_jj_fil_startdate"
        });

        let edate  = currecRecord.getText({
            fieldId: "custpage_jj_fil_enddate"
        });
        // let inactive = currecRecord.getValue({
        //     fieldId: "custpage_fil_inactive"
        // });
        let active = currecRecord.getValue({
            fieldId: "custpage_jj_fil_active"
        });
        console.log("sdate",sdate);
        console.log("edate",edate);
        console.log("active",active);
        let activeChecbox;
        if(active == true){
            activeChecbox ='T';
        }
        if(active == false){
            activeChecbox = 'F';
        }
        // else{
            
        // }
        // console.log("inactive",inactive);
        if(sdate && edate && (active == true || active == false))
        {   
            let butV = currecRecord.setValue({
                fieldId: "custpage_jj_fil_active",
                value: active,
                ignoreFieldChange: true,
            })
            console.log("active",butV);
            console.log("if working");
            document.location = url.resolveScript({
                deploymentId: "customdeploy_jj_sl_cust_det_otp7442",
                scriptId: "customscript_jj_sl_cust_det_otp7442",
                params: {
                    dstart:sdate,
                    dend:edate,
                    actchec:activeChecbox
                }
            });
        }
    }

     /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
     function sublistChanged(scriptContext) {
        let currobj = scriptContext.currentRecord;
        let lineCount = currobj.getLineCount({
            sublistId: "custpage_jj_sublist"
        });
        for (let i =0;i<lineCount;i++){
            let selectstatus = currobj.getSublistValue({
                sublistId: "custpage_jj_sublist",
                fieldId:"custpage_jj_sub_select",
                line:i
            })
            if(selectstatus ==='T'){
               return false;
            }
        }


     }
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        getValues:getValues,
        sublistChanged:sublistChanged
    };
    
});
