## openai-chatgpt-docker-container
![](https://imgur.com/N01dq3S.png)
![](https://imgur.com/8PLWsve.png)

Following on from my [openai-chatgpt-terminal](https://github.com/jameswylde/openai-chatgpt-terminal) project to add ChatGPT functionality to my terminal, I wanted something self hosted on my homelab - and can be installed app-like on my phone so moved this project to a container. Simple webapp utilising python's Flask and OpenAI module to provide a simple chat interface; able to choose between different API models (gpt-4,gpt-3.5-turbo), refresh, dark mode and code block formatting and one click copy to clipboard.


## Pull

Pull from dockerhub - [dockerhub | jamescwylde/openai-chatgpt-docker](https://hub.docker.com/repository/docker/jamescwylde/openai-chatgpt-docker/general):

- ARM:
```
docker pull jamescwylde/openai-chatgpt-docker:arm
```
- x86:
```
docker pull jamescwylde/openai-chatgpt-docker:latest
```

Pass your OpenAI API key as an env variable, `-e OPENAI_API_KEY="API_HERE"`. _i.e_

```
docker run -d -p 6565:6565 -e OPENAI_API_KEY="API_HERE" --network vnet jamescwylde/openai-chatgpt-docker:arm
```



## Build

Change, build and tag: 

```
git clone https://github.com/jameswylde/openai-chatgpt-docker-container.git
```
```
cd openai-chatgpt-docker-container
```

```
docker buildx build --platform linux/amd64 -t yourname/projectname:latest .
```
```
docker run -d -p 6565:6565 -e OPENAI_API_KEY="API_KEY" yourname/projectname:latest 
```
