#!/bin/sh

######################################################################
#### Build component files in 'src' directory.  ######################
#### e.g.:                                      ######################
#### bash buildPackage.sh                       ######################
#### # user entry                               ######################
#### mainMenu.user.profile                      ######################
#### # directories and files created:           ######################
#### main-menu/user/profile                     ######################
#### 			profile.js														######################
#### 			profile.spec.js                       ######################
#### 			profile.html                          ######################
######################################################################

function exit_script {
	echo -e "\n----------------------------------------"
	#print all arguments
	echo $@
	echo -e "----------------------------------------\n"
	exit 1
}
function array_join_by {
  local d=${1-} f=${2-}
  if shift 2; then
    printf %s "$f" "${@/#/$d}"
  fi
}
function str_to_kebab-kase {
	echo $1 | sed -r 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'	
}
function spinal_to_upper {
    IFS=- read -ra str <<<"$1"
    printf '%s' "${str[@]^}"
}

echo "Type the path(camelCase) to the component separated by '.' and press [ENTER], ejem:
mainMenu.users.profile"
## get user package
read userPackage

## no user input, exit program
if [ -z "$userPackage" ]
then
  exit_script "You must enter a valid component name, e.g.: 'mainMenu.users.profile'."
fi

## goto "src" directory(create it if it does not exist)
appDirectory="src/"
if ! [ -d $appDirectory ]
then
	mkdir src
fi
cd $appDirectory

## remove interior spaces in userPackage
userPackage=${userPackage// /}
echo "userPackage -> "$userPackage

## package string split by "." into array 'folders'
IFS='.' read -r -a folders <<< "$userPackage"
## get last element(component name)
componentName="${folders[${#folders[@]}-1]}"
componentNameCamelCase=componentName
## component class name in PascalCase
componentName=${componentName^}
## file name in kebab-case
fileName=$(str_to_kebab-kase $componentName)
echo "componentName -> "$componentName
echo "fileName -> "$fileName

## save root path
foldersLength=${#folders[*]}
rootPath=""
for ((i=0; i<$foldersLength; i++)); do rootPath+="../"; done
echo "rootPath = "$rootPath

## all folders in kebab-case
count=0
for i in "${folders[@]}"
do
	folders[$count]=$(str_to_kebab-kase $i)
	count=$((count + 1))
done

## extracts from "userPackage" a series of values, class name, 
## directory and file names, css class names...
bemName=$(array_join_by '__' ${folders[*]})
# kebabCaseName=$(str_to_kebab-kase $userPackage)
# kebabCaseName=${kebabCaseName//[\.]/-}
pascalCaseName=$(spinal_to_upper $kebabCaseName)

packagePath=$(array_join_by '/' ${folders[*]})

echo "-------------------------------"
# echo "bemName -> "$bemName
# echo "kebabCaseName -> "$kebabCaseName
# echo "pascalCaseName -> "$pascalCaseName
echo "packagePath-> "$packagePath

## if the folder does not exist, the component is created
## if the folder exists but does not contain a component
##   the component is created
if [ -d $packagePath ]
then
	## folder exists
	if [ -f $packagePath/$fileName".js" ]
	then
		## the component has already been created
		exit_script "ERROR: The component '"$componentName"' already exists in the directory: "$packagePath
	fi
else
	## build folder
  mkdir -p $packagePath
fi

## goto folder
cd $packagePath

TAB='\t';
LINE_BREAK='\n';

## component template
file=$fileName".html"
touch $file
str=""
str=$str"<template>"$LINE_BREAK
str=$str$TAB"<style>/* */</style>"$LINE_BREAK
str=$str"$TAB<div>$componentName</div>"$LINE_BREAK
str=$str"</template>"$LINE_BREAK
echo -e $str >> $file

## component
file=$fileName".js"
touch $file
str=""
str=$str"import {logger, getUniqueId} from '"$rootPath"utils.js';"$LINE_BREAK
str=$str"import Locale from '"$rootPath"locale.js';"$LINE_BREAK
str=$str"import FileManager from '"$rootPath"file-manager.js';"$LINE_BREAK$LINE_BREAK
str=$str"class "$componentName" extends HTMLElement{"$LINE_BREAK
str=$str$TAB"constructor(){"$LINE_BREAK
str=$str$TAB$TAB"super();"$LINE_BREAK
str=$str$TAB$TAB"this.ID = getUniqueId();"$LINE_BREAK
str=$str$TAB"}"$LINE_BREAK
str=$str$TAB"updateLang(){"$LINE_BREAK
str=$str$TAB$TAB"Locale.update(this.shadow.querySelectorAll('[data-lang]'));"$LINE_BREAK
str=$str$TAB"}"$LINE_BREAK
str=$str$TAB"addListeners(){}"$LINE_BREAK
str=$str$TAB"removeListeners(){}"$LINE_BREAK
str=$str$TAB"connectedCallback(){"$LINE_BREAK
str=$str$TAB$TAB"(async ()=>{"$LINE_BREAK
str=$str$TAB$TAB$TAB"const template = await FileManager.getHtml('./src/"$packagePath"/"$fileName".html');"$LINE_BREAK
str=$str$TAB$TAB$TAB"this.shadow	= this.attachShadow({mode: 'open'});"$LINE_BREAK
str=$str$TAB$TAB$TAB"this.shadow.appendChild(template.content.cloneNode(true));"$LINE_BREAK
str=$str$TAB$TAB$TAB"Locale.suscribe(this.ID, this.updateLang.bind(this));"$LINE_BREAK
str=$str$TAB$TAB$TAB"this.addListeners();"$LINE_BREAK
str=$str$TAB$TAB"})();"$LINE_BREAK
str=$str$TAB"}"$LINE_BREAK
str=$str$TAB"disconnectedCallback(){"$LINE_BREAK
str=$str$TAB$TAB"this.removeListeners();"$LINE_BREAK
str=$str$TAB$TAB"Locale.unsuscribe(this.ID);"$LINE_BREAK
str=$str$TAB"}"$LINE_BREAK
str=$str$TAB"static get observedAttributes(){"$LINE_BREAK
str=$str$TAB$TAB"return [];"$LINE_BREAK
str=$str$TAB"}"$LINE_BREAK
str=$str$TAB"attributeChangedCallback(name, oldValue, newValue){"$LINE_BREAK
str=$str$TAB"}"$LINE_BREAK
str=$str$TAB"/*appendComponent(name, component){"$LINE_BREAK
str=$str$TAB$TAB"customElements.define(name, component);"$LINE_BREAK
str=$str$TAB$TAB"return this.shadowRoot.querySelector(name);"$LINE_BREAK
str=$str$TAB"}*/"$LINE_BREAK
str=$str"};"$LINE_BREAK$LINE_BREAK
str=$str"export default "$componentName";"$LINE_BREAK
echo -e $str >> $file


## test
file=$fileName".spec.js"
touch $file
str=""
str=$str"//import "$componentName" from './"$fileName".js';"$LINE_BREAK
str=$str"//import chai from 'chai';"$LINE_BREAK$LINE_BREAK
str=$str"//const assert = chai.assert;"$LINE_BREAK
str=$str"describe('check "$componentName"', function(){"$LINE_BREAK
str=$str"\tit('check {NAME} function', function(){"$LINE_BREAK
str=$str"\t\t// test code..."$LINE_BREAK
str=$str"\t});"$LINE_BREAK
str=$str"});"$LINE_BREAK
echo -e $str >> $file

exit_script "Component '"$componentName"' created."
