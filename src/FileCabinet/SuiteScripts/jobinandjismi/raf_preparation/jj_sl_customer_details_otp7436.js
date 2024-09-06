/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/ui/serverWidget', 'N/runtime', 'N/record','N/email','N/task'],
    /**
 * @param{search} search
 * @param{serverWidget} serverWidget
 * @param{runtime} runtime
 * @param{record} record
 * @param{email} email
 * @param{task} task 
 */
    (search, serverWidget, runtime, record, email, task) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */

       function getData(sublistId,request,lineCount,status){
       try{

        //let status = request.parameters.sublistcheck;
        let customer;
        let name;
        let emailId;
        let phone;
        let userObj = runtime.getCurrentUser();
        let currentUser = userObj.name;
        for(let i=0;i<lineCount;i++){
            let select = request.getSublistValue({
                group: sublistId,
                line:i,
                name: "custpage_jj_sub_select"
            });
            if(select ==='T'){
          
            customer = request.getSublistValue({
                group: sublistId,
                line:i,
                name: "custpage_jj_sub_internalid"
            });
            name  = request.getSublistValue({
                group: sublistId,
                line:i,
                name: "custpage_jj_sub_name"
            });
            emailId  = request.getSublistValue({
                group: sublistId,
                line:i,
                name: "custpage_jj_sub_email"
            });
            phone  = request.getSublistValue({
                group: sublistId,
                line:i,
                name: "custpage_jj_sub_phone"
            });
          
            }  
        }
        let recordObj = record.create({
            type: "customrecord_jj_suite_custom_otp7442",
            isDynamic: true
           })
           recordObj.setValue({
            fieldId: "custrecord_jj_current_user_otp7436",
            value: currentUser,
            ignoreFieldChange: true
           })
           if(status ==="T"){
            recordObj.setValue({
                fieldId: "custrecord_jj_inact_act_otp7436",
                value: true,
                ignoreFieldChange: true
               })
           }
           else{
            recordObj.setValue({
                fieldId: "custrecord_jj_inact_act_otp7436",
                value: false,
                ignoreFieldChange: true
               })
           }
          
           recordObj.setValue({
            fieldId: "custrecord_jj_phone_otp7436",
            value:phone,
            ignoreFieldChange: true
           })
           recordObj.setValue({
            fieldId: "custrecord_jj_email_otp7436",
            value: emailId,
            ignoreFieldChange: true
           })
           recordObj.setValue({
            fieldId: "custrecord_jj_customer_id_otp7436",
            value: customer,
            ignoreFieldChange: true
           })
           let recid = recordObj.save()
           body = "user"+currentUser+"\n"+"Internalid"+customer+"\n"+"Name"+name+"\n"+"email"+emailId+"\n"+"phone"+phone+"\n"+"Active/Inactive"+status+"\n"+"recordid"+recid;
        return body
       }catch(e){
        log,error("error",e.message)
       }
       }
       
      
        const onRequest = (scriptContext) => {
        try{
            if(scriptContext.request.method === "GET"){
                let form = serverWidget.createForm({
                    title: "Customer Details",
                });
                
               
                form.clientScriptFileId = 2849;
               
            
                form.addFieldGroup({
                    id: "custpage_jj_filterform",
                    label: "Filters"
                });

                let startd = form.addField({
                    id: "custpage_jj_fil_startdate",
                    label:"StartDate",
                    type: serverWidget.FieldType.DATE,
                    container: "custpage_jj_filterform"
                });
                startd.isMandatory =  true;
                let endd = form.addField({
                    id: "custpage_jj_fil_enddate",
                    label:"End Date",
                    type: serverWidget.FieldType.DATE,
                    container: "custpage_jj_filterform"
                });
                endd.isMandatory = true;
                let activeCheck  = scriptContext.request.parameters.actchec||'';
                let act = form.addField({
                    id: "custpage_jj_fil_active",
                    label: "Active Customer",
                    type: serverWidget.FieldType.CHECKBOX,
                    container: "custpage_jj_filterform"
                });
                if(activeCheck =='T'){
                    act.defaultValue = 'T';
                }
                else if(activeCheck =='F'){
                    act.defaultValue = 'F';   
                }
                act.defaultValue=activeCheck;
                let subList = form.addSublist({
                    id: "custpage_jj_sublist",
                    label:"Sales Order Details",
                    type: serverWidget.SublistType.LIST
                });
                subList.addField({
                    id: "custpage_jj_sub_internalid",
                    label: "Internalid",
                    type: serverWidget.FieldType.TEXT,
                })
                subList.addField({
                    id: "custpage_jj_sub_name",
                    label: "Name",
                    type: serverWidget.FieldType.TEXT,
                })
                subList.addField({
                    id: "custpage_jj_sub_email",
                    label: "Email",
                    type: serverWidget.FieldType.EMAIL,
                })
                subList.addField({
                    id: "custpage_jj_sub_phone",
                    label: "Phone",
                    type: serverWidget.FieldType.PHONE,
                });
                subList.addField({
                    id: "custpage_jj_sub_select",
                    label: "Select",
                    type: serverWidget.FieldType.CHECKBOX,
                });
            form.addButton({
                id: "custpage_jj_getdata",
                label:"Get Data",
                functionName: "formValues"
            });    
            form.addSubmitButton({
                label: "Submit"
            });

                let starddate = scriptContext.request.parameters.dstart||'';
                let endddate  = scriptContext.request.parameters.dend||'';
                // let inactiveCheck = scriptContext.request.parameters.inactchec||'';
                
              
                if(starddate && endddate){
                    log.debug("startdate",starddate);
                    log.debug("enddate",endddate);
                    startd.defaultValue = starddate;
                    endd.defaultValue = endddate;
                 
                    let filter = [
                        ["mainline","is","T"]
                    ];
                    log.debug("activedebug",activeCheck);
                    if(activeCheck === 'T'){
                    filter.push("AND",["trandate","within",starddate,endddate])
                    }
                    else{
                        filter.push("AND",["trandate","notwithin",starddate,endddate])    
                    }
                    log.debug("filter",filter);
                    let searchObj =  search.create({
                        type: search.Type.SALES_ORDER,
                        filters: filter,
                        columns: [
                            search.createColumn({
                                name: "internalid",
                                join: "customerMain",
                                label: "Internal ID"
                             }),
                             search.createColumn({name: "entity", label: "Name"}),
                             search.createColumn({
                                name: "email",
                                join: "customerMain",
                                label: "Email"
                             }),
                             search.createColumn({
                                name: "phone",
                                join: "customerMain",
                                label: "Phone"
                             })
                        ]
                    })
                    let results = searchObj.run().getRange({
                        start: 0,
                        end: 1000
                    });
                    log.debug("length",results.length);
                    for(let i = 0;i<results.length;i++){
                        subList.setSublistValue({
                            id: "custpage_jj_sub_internalid",
                            line: i,
                            value: results[i].getValue({
                                name: "internalid",
                                join: "customerMain",
                                label: "Internal ID"
                            })
                        })
                        subList.setSublistValue({
                            id: "custpage_jj_sub_name",
                            line: i,
                            value: results[i].getText({
                               name: "entity", label: "Name"
                            })
                        })
                        subList.setSublistValue({
                            id: "custpage_jj_sub_email",
                            line: i,
                            value:results[i].getValue({
                                name: "email",
                                join: "customerMain",
                                label: "Email"
                             })||null
                        })
                        subList.setSublistValue({
                            id: "custpage_jj_sub_phone",
                            line:i,
                            value: results[i].getValue({
                                name: "phone",
                                join: "customerMain",
                                label: "Phone"
                            })||null
                        })
                     }
                }
                scriptContext.response.writePage(form);
            }else{
                
                let request = scriptContext.request;
                let sublistId = "custpage_jj_sublist";
                let body;
                let starddate = request.parameters.custpage_jj_fil_startdate;
                log.debug("startd",starddate);
                let endddate = request.parameters.custpage_jj_fil_enddate;
                log.debug("endddate",endddate)
                let lineCount = request.getLineCount({
                    group: sublistId
                });
               
                let status = request.parameters.custpage_jj_fil_active;
                // let paramObj = JSON.stringify({"start_date":starddate,"enddate":endddate});
                let taskObj = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    deploymentId: "customdeploy_jj_mr_send_email_otp7436",
                    scriptId: "customscript_jj_mr_send_email_otp7436"
                 
                })
                let taskId = taskObj.submit();

                if(lineCount > 0)
               {
                body = getData(sublistId,request,lineCount,status)
                // body = body + "inactstatus"+inactstatus+"\n"+"actstatus"+actstatus;
               }
               else{
                body = "sdfghj";
               }
               log.debug("body",body);
                scriptContext.response.write(body);

            }
        }catch(e){
            log.debug("error",e.message+e.stack)
        }
        }

        return {onRequest}

    });
