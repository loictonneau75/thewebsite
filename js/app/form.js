import * as DH from "../tools/domHelper.js"
import * as utils from "../tools/utils.js"
import * as storage from "../tools/storage.js"
import * as event from "../tools/event.js"

export class Form{
    constructor(config, label){
        this.collectablesNames = config.collectables.en
        this.lang = utils.getlang()
        this.label = label[this.lang]
        this.fieldsData = config.fields
        this.haveInputRequired = false

        this.section = DH.createCustomElement("section", {
            classList: ["form-section"]
        })
        this.form = DH.createCustomElement("form", {
            classList: ["form"],
            autocomplete :"off"
        })
        this.fieldsData.forEach(fieldRowData => this.buildRow(fieldRowData));
        this.createCommentary()
        this.createSubmitBtn()
        
        this.section.appendChild(this.form)
    }
    build(){
        return this.section
    }

    buildRow(rowData){
        const row = DH.createCustomElement("div", {
            classList: ["form-row"]
        })
        Object.values(rowData).forEach(inputData => {
            this.buildInput(inputData, row)
        })
        this.form.appendChild(row)
    }

    buildInput(data, parent){
        const inputWrapper = DH.createCustomElement("div", {
            classList: ["form-input-wrapper"]
        }) 
        if (data.otherId){inputWrapper.append(...this.otherChoice(data))}
        //else if(data.choiceId){}
        //else if(data.textarea){}
        else inputWrapper.appendChild(this.createSimpleInput(data))
        parent.appendChild(inputWrapper)

        if(data.nbColumn && data.nbColumn > 0) this.addEmptyInputWrapper(data, parent)
    }

    addEmptyInputWrapper(data, parent){
        const nbEmpty = data.nbColumn - 1
            for (let i = 0; i < nbEmpty; i++){
                const emptyWrapper = DH.createCustomElement("div", {
                    classList: ["form-input-wrapper", "empty"]
                })
                parent.appendChild(emptyWrapper)
            }
    }

    createSimpleInput(data){
        const input = DH.createCustomElement("input", {
            id: data.id,
            type: "text",
            placeholder: this.required(data),
            classList: ["form-input"]
        })
        return input
    }

    otherChoice(data){
        const options = storage.getDataFromLocalStorage(data.storageKey)
        if (options.length > 0){
            const innerwrapper = DH.createCustomElement("div",{
                classList: ["form-input-wrapper-inner"]
            })
            const input = this.createSimpleInput(data)
            input.readOnly = "readOnly"
            const caret = DH.createCustomElement("div", {
                classList: ["form-input-caret"]
            })
            innerwrapper.append(input, caret)

            const suggestionWrapper = DH.createCustomElement("div",{
                classList: ["form-input-choice-wrapper"]
            });
            [this.label.other, ...options].forEach(option => {
                console.log(option)
                const button = DH.createCustomElement("button",{
                    type: "button",
                    textContent:option
                })
                suggestionWrapper.appendChild(button)
            })
            event.showOnFocus(suggestionWrapper, input)
            return [innerwrapper,suggestionWrapper]
        }
        else{
            return [this.createSimpleInput(data)]
        }
    }

    required(data){
        if(data.required){
            this.haveInputRequired = true
            return `${data.label[this.lang]}*`
        }
        return data.label[this.lang]
    }

    createCommentary(){
        if(this.haveInputRequired){
            const p = DH.createCustomElement("p", {
                classList: ["form-note"]
            })
            p.append(
                document.createTextNode(this.label.required[0] + " "), // ex: "Fields marked with "
                DH.createCustomElement("span", {
                    classList: ["form-asterisk"],
                    innerText: this.label.required[1]
                }),
                document.createTextNode(" " + this.label.required[2]) // ex: " are required."
            )
            this.form.appendChild(p)
        }
    }

    createSubmitBtn(){
        const submitButton = DH.createCustomElement("button", {
            type: "button",
            innerText: this.label.save,
            classList: ["form-button"]
        })
        this.form.appendChild(submitButton)
    }
    
}