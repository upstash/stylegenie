is_valid_system_prompt = 'People will give a description of a cloth they want. I want your returned results to be only 2 types. 1: True 2: False . For True you should accept input prompts like: Thick woolen sweater in burgundy for a cozy winter, Red dress, Blue dress for to wear in wedding, Brown cargo pants, Plush black coat with leather details. For other non-relevant fashion product prompts return "False".'
merge_system_prompt = 'I want you to give a final prompt from the list into one Dall-E prompt. The list is prompt history so last prompt is the most recent.'

def is_valid_prompt(client, prompt):
    response = client.chat.completions.create(
      model="gpt-4",
      messages=[
        {"role": "system", "content": is_valid_system_prompt},
        {"role": "user", "content": prompt}
      ]
    )
    
    return response.choices[0].message.content
      
def merge_prompts(client, prompts):
    prompt = ""
    for i in range(len(prompts)):
        prompt += str(i+1) + ". " + prompts[i] + " "
    
    response = client.chat.completions.create(
      model="gpt-4",
      messages=[
        {"role": "system", "content": merge_system_prompt},
        {"role": "user", "content": prompt}
      ]
    )
    
    return response.choices[0].message.content
  
    
    
    
    
    
    