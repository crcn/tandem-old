function add(arg1, arg2) {
    return arg1 + arg2;
}

<#function id="add" parameters={[<#param name="arg1" />, <#param name="arg2" />}>
  <#return value={<#add values={[<#ref name="arg1" />, <#ref name="arg2" />]} />} />
</#function>

<#call target={<#ref id="add" />} parameters={[<#number value={1} />, <#number value={2} />]} />