#!/bin/bash

uvicorn app.backend.main:app --reload --port 8080 &
open http://localhost:8080/