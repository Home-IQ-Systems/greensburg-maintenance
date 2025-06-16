// app/api/projects/[id]/notes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProjectNotes, addNote } from '@/lib/database';

// GET /api/projects/[id]/notes - Get all notes for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notes = await getProjectNotes(params.id);
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/notes - Add new note to project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { text, author } = await request.json();
    
    if (!text || !author) {
      return NextResponse.json(
        { error: 'Text and author are required' },
        { status: 400 }
      );
    }

    const newNote = await addNote(params.id, text, author);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}