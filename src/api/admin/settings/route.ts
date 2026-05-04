/**
 * OMNIVOID LABS - Admin Settings API
 * 
 * GET /api/admin/settings - Get all settings (requires auth)
 * PUT /api/admin/settings - Update settings (requires auth)
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

// GET /api/admin/settings - Get all settings
async function handleGet(_userId: string, _request: Request): Promise<Response> {
  try {
    const settings = await prisma.siteSettings.findMany({
      orderBy: { key: 'asc' }
    });

    // Convert to a key-value object for easier access
    const settingsObj: Record<string, any> = {};
    for (const setting of settings) {
      settingsObj[setting.key] = setting.value;
    }

    return Response.json({
      success: true,
      data: settingsObj
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while fetching settings' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update settings
async function handlePut(_userId: string, request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const settings = body.settings;

    if (!settings || typeof settings !== 'object') {
      return Response.json(
        { success: false, error: 'INVALID_INPUT', message: 'Settings object is required' },
        { status: 400 }
      );
    }

    const updatedSettings = [];

    // Update or create each setting
    for (const [key, value] of Object.entries(settings)) {
      const setting = await prisma.siteSettings.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any }
      });
      updatedSettings.push(setting);
    }

    return Response.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while updating settings' },
      { status: 500 }
    );
  }
}

// Main handlers with authentication
export async function GET(request: Request): Promise<Response> {
  return requireAuth(handleGet)(request);
}

export async function PUT(request: Request): Promise<Response> {
  return requireAuth(handlePut)(request);
}