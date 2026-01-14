#!/bin/bash

uvicorn app.backend.main:app --reload &
open http://localhost:8000/welcome