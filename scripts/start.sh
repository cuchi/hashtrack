#!/usr/bin/env bash

yarn workspace hashtrack-client run build
yarn workspace hashtrack-server run dev:up
yarn workspace hashtrack-server run dev
