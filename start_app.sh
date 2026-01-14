#!/bin/bash

uvicorn app.backend.main:app --reload &
open app/frontend/index.html