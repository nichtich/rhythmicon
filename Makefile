test:
	npm run test --workspaces

lint:
	npm run lint

fix:
	npm run lint -- --fix

ci:
	npm ci --workspaces

build:
	npm run build --if-present --workspaces

docs:
	npm run doc --if-present --workspaces

data: rhythms.json categories.json

rhythms.json: rhythms/*.md
	npm run rhythms

categories.json: categories/*.md
	npm run categories

dev:
	cd package/rhythmicon-app; npm run dev

all: ci test build
